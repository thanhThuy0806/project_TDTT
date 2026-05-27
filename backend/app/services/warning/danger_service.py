"""
danger_service.py — Dynamic WebRAG Danger Warning Service

Luồng hoạt động:
1. Nhận tọa độ (lat, lng) từ API
2. Kiểm tra cache (TTL 5 phút, grid ~500m)
3. Nếu cache miss: SearXNG search + Reverse Geocoding → LLM phân tích → cache kết quả
4. Trả về kết quả
"""

import json
import time
import os
import logging
from datetime import datetime
from dotenv import load_dotenv

from geopy.geocoders import Nominatim
from langchain_community.utilities import SearxSearchWrapper
from langchain_ollama.chat_models import ChatOllama
from langchain.agents import create_agent # Tùy thuộc vào phiên bản Langchain bạn đang dùng
from langchain_core.tools import tool

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
today = datetime.today()

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
SEARXNG_HOST = os.getenv("SEARXNG_URL", "http://localhost:8888")
OLLAMA_MODEL_NAME = os.getenv("OLLAMA_MODEL_NAME", "Gemma4:E4B")
OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL", "300")) 
GRID_PRECISION = 3  

# INTEGRATED TOOLS
searXNG = SearxSearchWrapper(searx_host=SEARXNG_HOST)
geo = Nominatim(user_agent="project TDTT")

@tool("search tool")
def search_data(query: str):
    """
    Arg:
        query: a str of keyword use for searching on SearXNG
    Output: real time data relavant with searching str return by SearXNG 
    Always use this to retrieve real time data on Internet before response
    this is an integrated meta search engine to help LLM retrieves real time data
    """
    return searXNG.run(query=query)

@tool('map access tool')
def search_map(lat: float, lng: float, limit: int = 2) -> str:
    """ 
    Args:
        lat: latitude
        log: longtitude
        limit: maximum number of function call per reply
    Output: a string contains information of the position on the map
    the tool help model to search and retrieve infomation from map through map API calling
    information may include:
        - name of that location
        - weather
        - traffic
        - etc...
    """
    return [lat, lng]

@tool("reverse geocoding tool")
def reverse_geocoding(lat: float, lng: float) -> str:
    """
        Agrs:
            - lat: latitude, a float number represent the latitude of the place on the map you want to find its name
            - lng: longitude, a float number represent the longitude of the place on the map you want to find its name  
        Output: the exact location name represent as a strin
        Use this function when you need to find the name of the position but only have latitude and longitude of that location
    """
    try:
        
        location = geo.reverse(
            query=(lat, lng), language='vi', exactly_one=True, timeout=10
        )
        if location and location.address:
            return location.address
        return f"{lat}, {lng}"
    except Exception as e:
        logger.warning(f"Reverse geocoding failed: {e}")
        return f"{lat}, {lng}"
    
@tool("forward geocoding tool")
def forward_geocoding(place: str):
    """
        Argvs:
            place: a string contains specific place on earth( for example: E205, block E, Uniersity of Science - VietName national university HCM, Dong Hoa, Thu Duc City, Ho Chi Minh City, Viet Nam)
        Output: the coordinate including latitude and longitude as float number of that spot
        
        if user's prompt has some place where you need to know the specific coord, use this
    """
    try:
        location = geo.geocode(place, exactly_one=True, language='vi', timeout=10)
        if location:
            return { "lat": location.latitude, "lng": location.longitude}
    except Exception as e:
        logger.warning(f"Failed to find specific location: {e}")
        return place
    
    
    
# ─────────────────────────────────────────────
# CACHE LAYER
# ─────────────────────────────────────────────
class DangerCache:
    # (Phần này bạn code rất ổn, mình giữ nguyên)
    def __init__(self, ttl: int = CACHE_TTL_SECONDS, precision: int = GRID_PRECISION):
        self._cache: dict = {}
        self._ttl = ttl
        self._precision = precision

    def _make_key(self, lat: float, lng: float) -> str:
        rlat = round(lat, self._precision)
        rlng = round(lng, self._precision)
        return f"{rlat},{rlng}"

    def get(self, lat: float, lng: float) -> dict | None:
        key = self._make_key(lat, lng)
        entry = self._cache.get(key)
        if entry is None:
            return None
        if time.time() - entry["timestamp"] > self._ttl:
            del self._cache[key]
            logger.info(f"Cache expired for {key}")
            return None
        logger.info(f"Cache HIT for {key}")
        return entry["data"]

    def set(self, lat: float, lng: float, data: dict):
        key = self._make_key(lat, lng)
        self._cache[key] = {"data": data, "timestamp": time.time()}
        logger.info(f"Cache SET for {key}")

# ─────────────────────────────────────────────
# WEBRAG SERVICE (SearXNG + LLM)
# ─────────────────────────────────────────────
class WebRAGService:
    def __init__(self):
        self.llm = ChatOllama(model=OLLAMA_MODEL_NAME,
                              base_url=OLLAMA_BASE_URL,
                              temperature=0,
                              reasoning=False,
                              headers={"ngrok-skip-browser-warning": "true"})
        self.agent = create_agent(self.llm, tools=[reverse_geocoding, forward_geocoding, search_data])
        
    # placeOrCoord: address or coordinate
    async def analyze(self, placeOrCoord: str, header: list[str], prompt: str):
        query = prompt.format(today=today, place=placeOrCoord)
        input = {"messages": [("user", query)]}
        
        try:
            response = await self.agent.ainvoke(input=input)
            
            if isinstance(response, dict) and "output" in response:
                content = response["output"].strip()
            elif isinstance(response, dict) and "messages" in response:
                content = response["messages"][-1].content.strip()
            else:
                content = str(response).strip()

            if "```json" in content:
                    content = content.split("```json")[1].split('```')[0].strip()
            elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()

            data = json.loads(content)
            result = {}
            for argv in header:
                result[argv] = data.get(argv, "")
            result["source"] = "agentic LLM + SearXNG + MapBox"
            
            print(f'LLM gen result: {result}')
            return result
            
        except json.JSONDecodeError:
            logger.warning(f'LLM return non-JSON response: {content[:200]}')
            danger_keywords = ["ngập", "tai nạn", "cháy", "kẹt xe", "sạt lở", "nguy hiểm"]
            is_danger = any(kw in content.lower() for kw in danger_keywords)
            
            fallback_alerts = [{"severity": "medium" if is_danger else "low", "text": content[:200]}] if is_danger else []
            
            return {
                "is_danger": is_danger,
                "severity": "medium" if is_danger else "safe",
                "place_name": placeOrCoord, # SỬA: Đồng bộ biến
                "alerts": fallback_alerts,
                "source": "agentic LLM + SearXNG + MapBox",
            }
        except Exception as e:
            logger.error(f"LLM analysis failed: {e}")
            return {
                "is_danger": False,
                "severity": "safe",
                "place_name": placeOrCoord, # SỬA: Đồng bộ biến
                "alerts": [],
                "source": "agentic LLM + SearXNG + MapBox",
                "error": str(e),
            }
# ─────────────────────────────────────────────
# MAIN ORCHESTRATOR
# ─────────────────────────────────────────────
class DangerCheckService:
    def __init__(self):
        self.cache = DangerCache()
        self.web_rag = WebRAGService()
        logger.info("DangerCheckService initialized")

    async def check(self, placeOrCoord: str, header: list[str], prompt: str) -> dict:
        # 1. Trích xuất lat, lng từ chuỗi đầu vào để phục vụ Cache và Frontend
        lat, lng = None, None
        try:
            # TH1: Đầu vào là chuỗi tọa độ (ví dụ: "10.762, 106.660" hoặc "10.762 106.660")
            parts = placeOrCoord.replace(",", " ").split()
            if len(parts) >= 2:
                lat = float(parts[0])
                lng = float(parts[1])
        except (ValueError, IndexError):
            # TH2: Đầu vào là tên địa danh (ví dụ: "Núi Phú Sĩ")
            # Chủ động dùng geo module để quy đổi ra tọa độ trước
            try:
                location = geo.geocode(placeOrCoord, exactly_one=True, language='vi', timeout=10)
                if location:
                    lat, lng = location.latitude, location.longitude
            except Exception as e:
                logger.warning(f"Không thể lấy tọa độ tĩnh cho địa danh {placeOrCoord}: {e}")

        results = {
            "lat": lat,
            "lng": lng,
            "place_name": placeOrCoord,
            "is_danger": False,
            "status": "safe",
            "alerts": [],
        }

        # 2. Kiểm tra Cache (chỉ khi xác định được lat, lng)
        if lat is not None and lng is not None:
            cached = self.cache.get(lat, lng)
            if cached is not None:
                results["is_danger"] = cached.get("is_danger", False)
                results["status"] = cached.get("status", "safe")
                results["alerts"] = cached.get("alerts", [])
                results["place_name"] = cached.get("place_name", placeOrCoord)
                return results

        dynamic_result = await self.web_rag.analyze(placeOrCoord, header, prompt)

        results["is_danger"] = dynamic_result.get("is_danger", False)
        results["status"] = dynamic_result.get("severity", "safe") 
        results["alerts"] = dynamic_result.get("alerts", [])
        
        # Nếu LLM phân tích ra tên địa điểm chuẩn mực hơn, ưu tiên lấy tên đó
        llm_place_name = dynamic_result.get("place_name", "")
        results["place_name"] = llm_place_name if llm_place_name else placeOrCoord

        # 4. Lưu Cache để tối ưu các lượt request sau
        if lat is not None and lng is not None:
            self.cache.set(lat, lng, results)

        return results

danger_service = DangerCheckService()