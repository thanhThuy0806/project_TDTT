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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
SEARXNG_HOST = os.getenv("SEARXNG_HOST", "http://localhost:8888")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "Gemma4:E2B")
OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'https://vowel-clerk-elope.ngrok-free.dev')
CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL", "300"))  # 5 minutes
GRID_PRECISION = 3  # Decimal places for grid rounding (~111m per 0.001°)

DANGER_ZONES_FILE = os.path.join(os.path.dirname(__file__), "danger_zones.json")


# ─────────────────────────────────────────────
# REVERSE GEOCODER
# ─────────────────────────────────────────────
class ReverseGeocoder:
    """Chuyển đổi (lat, lng) → tên địa danh bằng Nominatim (OpenStreetMap)."""

    def __init__(self):
        self.geolocator = Nominatim(user_agent="project_tdtt_safety")

    def get_place_name(self, lat: float, lng: float) -> str:
        """Reverse geocode tọa độ thành tên địa phương."""
        try:
            location = self.geolocator.reverse(
                (lat, lng), language="vi", exactly_one=True, timeout=10
            )
            if location and location.address:
                return location.address
            return f"{lat}, {lng}"
        except Exception as e:
            logger.warning(f"Reverse geocoding failed: {e}")
            return f"{lat}, {lng}"


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
    """
    Tìm kiếm thông tin nguy hiểm thời gian thực qua SearXNG,
    sau đó dùng LLM phân tích kết quả.
    """

    # Prompt ép LLM chỉ lọc tin trong 24h và trả về JSON
    ANALYSIS_PROMPT = """Bạn là một hệ thống cảnh báo an toàn du lịch. 
Dựa trên các kết quả tìm kiếm sau đây về khu vực "{place_name}", hãy phân tích và trả lời:

KẾT QUẢ TÌM KIẾM:
{search_results}

NGÀY HÔM NAY: {today}

YÊU CẦU:
Đối với các mối nguy hiểm cố hữu do tự nhiên như địa hình, khí hậu và tương tự
1. Đánh giá ĐẶC ĐIỂM ĐỊA LÝ/MÔI TRƯỜNG cố hữu (ví dụ: núi tuyết, eo biển xung đột, vực sâu, rừng rậm).
2. Đánh giá CÁC SỰ KIỆN MỚI NHẤT từ dữ liệu thời gian thực (tai nạn, thời tiết cực đoan, bạo loạn).
3. Nếu khu vực có rủi ro tự nhiên rõ ràng (như đỉnh núi Everest, Nam Cực) HOẶC có tin tức nguy hiểm, đánh giá is_danger = true.

Đối với các mối nguy hiểm là hoạt động an ninh chính trị, con người, tình trạng xã hội và tương tự
1. CHỈ xem xét các sự kiện xảy ra trong vòng 24 giờ qua (dựa trên ngày hôm nay).
2. Tập trung vào: tai nạn giao thông, ngập lụt, kẹt xe, cháy nổ, thời tiết xấu, sạt lở.
3. Nếu là các thảm hoạ kéo dài như bất ổn chính trị( xung đột sắc tộc), thảm họa nhân đạo, thảm họa( như sự cố nhà máy điện hạt nhân) thì nên lấy khoảng thời gian 2 năm trở lại đây

Trả lời bằng TIẾNG VIỆT.
Trả lời theo ĐÚNG format JSON sau (không thêm gì khác):
{{
    "is_danger": true hoặc false,
    "severity": "low" hoặc "medium" hoặc "high",
    "alert_text": "Mô tả ngắn gọn tình trạng nguy hiểm (nếu có) hoặc chuỗi rỗng nếu an toàn"
}}"""

    def __init__(self, searxng_host: str = SEARXNG_HOST, model: str = OLLAMA_MODEL, base_url: str = OLLAMA_BASE_URL):
        self.searx = SearxSearchWrapper(searx_host=searxng_host)
        self.llm = ChatOllama(
                model=model,
                base_url=base_url,
                temperature=0,
                headers={
                "ngrok-skip-browser-warning": "true"
            })

    def _search(self, place_name: str) -> str:
        """Tìm kiếm tin tức liên quan đến nguy hiểm tại khu vực."""
        query = f"{place_name} safety warning danger risks news"
        try:
            results = self.searx.run(query=query)
            
            print(f'Search Result: {results}\n\n')
            return results if results else "Không tìm thấy kết quả."
        except Exception as e:
            logger.error(f"SearXNG search failed: {e}")
            return f"Lỗi tìm kiếm: {e}"

    async def analyze(self, place_name: str) -> dict:
        """Tìm kiếm + dùng LLM phân tích kết quả."""
        # Step 1: Search
        search_results = self._search(place_name)

        # Step 2: Build prompt
        today = datetime.now().strftime("%Y-%m-%d %H:%M")
        prompt = self.ANALYSIS_PROMPT.format(
            place_name=place_name,
            search_results=search_results,
            today=today,
        )

        # Step 3: Call LLM
        try:
            response = await self.llm.ainvoke(prompt)
            content = response.content.strip()

            # Try to extract JSON from response
            # Handle case where LLM wraps JSON in ```json ... ```
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            result = json.loads(content)
            print(f'LLM gen result: {result}\n\n')
            
            return {
                "is_danger": result.get("is_danger", False),
                "severity": result.get("severity", "low"),
                "alert_text": result.get("alert_text", ""),
                "source": "web_rag",
            }
        except json.JSONDecodeError:
            logger.warning(f"LLM returned non-JSON response: {content[:200]}")
            # Fallback: if LLM mentions danger keywords, flag as potential danger
            danger_keywords = ["ngập", "tai nạn", "cháy", "kẹt xe", "sạt lở", "nguy hiểm"]
            is_danger = any(kw in content.lower() for kw in danger_keywords)
            return {
                "is_danger": is_danger,
                "severity": "medium" if is_danger else "low",
                "alert_text": content[:300] if is_danger else "",
                "source": "web_rag",
            }
        except Exception as e:
            logger.error(f"LLM analysis failed: {e}")
            return {
                "is_danger": False,
                "severity": "low",
                "alert_text": "",
                "source": "web_rag",
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
        self.geocoder = ReverseGeocoder()
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

        # ── 2. Reverse geocode ──
        place_name = self.geocoder.get_place_name(lat, lng)
        results["place_name"] = place_name

        # ── 3. Check cache for dynamic RAG ──
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

        # ── 4. Dynamic WebRAG (search + LLM) ──
        dynamic_result = await self.web_rag.analyze(place_name)
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
