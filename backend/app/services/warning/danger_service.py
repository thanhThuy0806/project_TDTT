"""
danger_service.py — Dynamic WebRAG Danger Warning Service

Luồng hoạt động:
1. Nhận tọa độ (lat, lng) từ API
2. Reverse geocode → tên địa danh
3. Kiểm tra cache (TTL 5 phút, grid ~500m)
4. Nếu cache miss: SearXNG search → LLM phân tích → cache kết quả
5. Đồng thời kiểm tra static danger zones (vách đá, khu vực cấm)
6. Trả về kết quả kết hợp
"""

import json
import time
import os
import logging
from datetime import datetime

from geopy.geocoders import Nominatim
from shapely.geometry import Point, Polygon
from langchain_community.utilities import SearxSearchWrapper
from langchain_ollama.chat_models import ChatOllama
from langchain.agents import create_agent
from langchain_ollama.chat_models import ChatOllama
from langchain_core.tools import tool
from langchain.agents import create_agent
# other lib
import json
import logging
from dotenv import load_dotenv
from app.prompt.system_prompt import WARNING_SERVICE_SYSTEM_PROMPT
# load secret
load_dotenv()
SEARXNG_URL = os.getenv('SEARXNG_URL')
OLLAMA_MODEL_NAME = os.getenv('OLLAMA_MODEL_NAME')
OLLAMA_BASE_URL = os.getenv('OLLAMA_URL')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
today = datetime.today()
# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
SEARXNG_HOST = os.getenv("SEARXNG_URL", "http://localhost:8888")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL_NAME", "Gemma4:E4B")
OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL", "300"))  # 5 minutes
GRID_PRECISION = 3  # Decimal places for grid rounding (~111m per 0.001°)

DANGER_ZONES_FILE = os.path.join(os.path.dirname(__file__), "danger_zones.json")
# INTEGRATED TOOLS
searXNG = SearxSearchWrapper(searx_host=SEARXNG_HOST)
@tool("search tool")
def search_data(query: str):
    """
    Arg:
        query: a str of keyword use for searching on SearXNG
    Output: real time data relavant with searching str return by SearXNG 
    Always use this to retrieve real time data on Internet before response
    this is an integrated meta search engine to help LLM retrieves real time data
    """
    # integrate searxng
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
        geo = Nominatim(user_agent="project TDTT")
        location = geo.reverse(
            query=(lat, lng), language='vi', exactly_one=True, timeout=10
        )
        if location and location.address:
            return location.address
        return f"{lat, lng}"
    except Exception as e:
        logger.warning(f"Reverse geocoding failed: {e}")
        return f"{lat, lng}"
# ─────────────────────────────────────────────
# CACHE LAYER
# ─────────────────────────────────────────────
class DangerCache:
    """
    In-memory cache with TTL, keyed by grid cell.
    Tọa độ được làm tròn → cùng 1 ô ~100-500m sẽ dùng chung cache.
    """

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
# STATIC DANGER ZONES
# ─────────────────────────────────────────────
class StaticDangerZones:
    """Quản lý các vùng nguy hiểm vĩnh viễn (vách đá, khu vực cấm, vực sâu)."""

    def __init__(self, filepath: str = DANGER_ZONES_FILE):
        self.zones = []
        self._load(filepath)

    def _load(self, filepath: str):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                raw = json.load(f)
            for zone in raw:
                self.zones.append({
                    "name": zone["name"],
                    "polygon": Polygon(zone["polygon"]),
                    "alert_text": zone["alert_text"],
                    "severity": zone.get("severity", "high"),
                })
            logger.info(f"Loaded {len(self.zones)} static danger zones")
        except FileNotFoundError:
            logger.warning(f"Danger zones file not found: {filepath}")
        except Exception as e:
            logger.error(f"Error loading danger zones: {e}")

    def check(self, lat: float, lng: float) -> dict | None:
        """Kiểm tra xem tọa độ có nằm trong vùng nguy hiểm cố định không."""
        point = Point(lng, lat)  # Shapely: (x=lng, y=lat)
        for zone in self.zones:
            if zone["polygon"].contains(point):
                return {
                    "is_danger": True,
                    "source": "static_zone",
                    "zone_name": zone["name"],
                    "severity": zone["severity"],
                    "alert_text": zone["alert_text"],
                }
        return None


# ─────────────────────────────────────────────
# WEBRAG SERVICE (SearXNG + LLM)
# ─────────────────────────────────────────────
class WebRAGService:
    """Agentic RAG combine with SearXNG and Mapbox"""
    def __init__(self):
        # temparature = 0: ràng buộc không cho phép 'sáng tạo' thêm từ thông tin sẵn có
        # reasoning = true: cho phép model suy luận
        self.llm = ChatOllama(model=OLLAMA_MODEL_NAME,
                              base_url=OLLAMA_BASE_URL,
                              temperature=0,
                              reasoning=True,
                              headers={"ngork-skip-browser-warning": "true"})
        self.agent = create_agent(self.llm, tools=[reverse_geocoding, search_data])
        self.geolocator = Nominatim(user_agent="project_tdtt_safety")
        
    async def analyze(self, lat: float, lng: float):
        query = WARNING_SERVICE_SYSTEM_PROMPT.format(
            lat=lat,
            lng=lng,
            today=today
        )
        input = {"messages": [("user", query)]}
        try:
            # Phân tích tình huống bằng agent
            response = await self.agent.ainvoke(input=input)
            # Lọc lấy kết quả
            if isinstance(response, dict) and "output" in response:
                content = response["output"].strip()
            elif isinstance(response, dict) and "messages" in response:
                content = response["messages"][-1].content.strip()
            else:
                content = str(response).strip()
            # Trích xuất file json
            if "```json" in content:
                    content = content.split("```json")[1].split('```')[0].strip()
            elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()

            result = json.loads(content)
            print(f'LLM gen result: {result}')
            # Trả kết quả
            return {
                "is_danger": result.get("is_danger", False),
                "severity": result.get("severity", "low"),
                "alert_text": result.get("alert_text", ""),
                "source": "agentic LLM + SearXNG + MapBox",
            }
        except json.JSONDecodeError:
            logger.warning(f'LLM return non-JSON response: {content[:200]}')
            danger_keywords = ["ngập", "tai nạn", "cháy", "kẹt xe", "sạt lở", "nguy hiểm"]
            is_danger = any( kw in content.lower() for kw in danger_keywords)
            return {
                "is_danger": is_danger,
                "severity": "medium" if is_danger else "low",
                "alert_text": content[:300] if is_danger else "",
                "source": "agentic LLM + SearXNG + MapBox",
            }
        except Exception as e:
            logger.error(f"LLM analysis failed: {e}")
            return {
                "is_danger": False,
                "severity": "low",
                "alert_text": "",
                "source": "agentic LLM + SearXNG + MapBox",
                "error": str(e),
            }


# ─────────────────────────────────────────────
# MAIN ORCHESTRATOR
# ─────────────────────────────────────────────
class DangerCheckService:
    """
    Orchestrator kết hợp:
    - Static danger zones (vùng cấm vĩnh viễn)
    - Dynamic WebRAG (sự kiện thời gian thực)
    - Cache layer (tránh gọi LLM liên tục)
    """

    def __init__(self):
        self.cache = DangerCache()
        self.static_zones = StaticDangerZones()
        self.web_rag = WebRAGService()
        logger.info("DangerCheckService initialized")

    async def check(self, lat: float, lng: float) -> dict:
        """
        Kiểm tra nguy hiểm tại tọa độ (lat, lng).
        Trả về kết quả kết hợp static zones + dynamic RAG.
        """
        results = {
            "lat": lat,
            "lng": lng,
            "place_name": None,
            "static_danger": None,
            "dynamic_danger": None,
            "is_danger": False,
            "status": "safe",
            "alerts": [],
        }

        # ── 1. Check static danger zones (instant, no cost) ──
        static_result = self.static_zones.check(lat, lng)
        if static_result:
            results["static_danger"] = static_result
            results["is_danger"] = True
            results["status"] = "danger"
            results["alerts"].append({
                "type": "static",
                "severity": static_result["severity"],
                "text": static_result["alert_text"],
                "zone": static_result["zone_name"],
            })

        # ── 2. Check cache for dynamic RAG ──
        cached = self.cache.get(lat, lng)
        if cached is not None:
            results["dynamic_danger"] = cached
            if cached.get("is_danger"):
                results["is_danger"] = True
                results["status"] = "danger"
                results["alerts"].append({
                    "type": "dynamic",
                    "severity": cached.get("severity", "medium"),
                    "text": cached.get("alert_text", ""),
                    "source": "cache",
                })
            return results

        # ── 3. Dynamic WebRAG (search + LLM) ──
        dynamic_result = await self.web_rag.analyze(lat, lng)
        self.cache.set(lat, lng, dynamic_result)

        results["dynamic_danger"] = dynamic_result
        if dynamic_result.get("is_danger"):
            results["is_danger"] = True
            results["status"] = "danger"
            results["alerts"].append({
                "type": "dynamic",
                "severity": dynamic_result.get("severity", "medium"),
                "text": dynamic_result.get("alert_text", ""),
                "source": "web_rag",
            })

        return results


# ── Singleton instance (khởi tạo khi import) ──
danger_service = DangerCheckService()