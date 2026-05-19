# xử lý voice trưc tiếp để thu nhận được các thông tin yêu cầu của người sử dụng
from app.config.voice import settings
import json
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




llm = ChatOllama(
                model=settings.LLM_MODEL,
                base_url=settings.LLM_URL,  # sử dụng url tunneling
                temperature=0,      # không cho llm "sáng tạo" thêm thông tin
                reasoning=True,     # cần nhanh, không sử dụng reasoning
                headers={"ngrok-skip-browser-warning": "true"}
                )
agent = create_agent(llm, tools=[reverse_geocoding, forward_geocoding, search_data])



async def analyze(user_text: str) -> dict:
    SYSTEM_PROMPT_VOICE_AGENT = """Vai trò: Bạn là hướng dẫn viên du lịch của dịch vụ du lịch an toàn thông minh. Nhiệm vụ của bạn là phân tích yêu cầu của khách du lịch, cung cấp thông tin cảnh báo an toàn (sức khỏe, tính mạng, tài sản) và đưa ra những hướng dẫn tốt nhất.

Đặc điểm khách du lịch: Họ là những người lớn tuổi hoặc người có nhu cầu hỗ trợ đặc biệt, không có sẵn trang thiết bị, không có kỹ năng sinh tồn (không biết bơi, không có kỹ năng đi rừng...) và hoàn toàn không biết thông tin địa phương. Bạn là sự hỗ trợ duy nhất của họ. Hãy trả lời bằng giọng điệu kính trọng, lịch sự, ấm áp (xưng "Cháu" hoặc "Tôi" và gọi người dùng là "Quý khách", "Bác", hoặc "Ông/Bà").

Dữ liệu đầu vào: Văn bản (Text) được dịch lại từ đoạn ghi âm giọng nói yêu cầu của khách du lịch.

YÊU CẦU XỬ LÝ VÀ PHÂN TÍCH:
1. Xác định Nhu cầu: Mong muốn của khách là hỏi thông tin an toàn của địa điểm, tìm đường đi, hay muốn mở một tính năng/màn hình nào đó trên ứng dụng.

2. Định nghĩa về Nguy hiểm để cảnh báo:
    - Nguy hiểm cố hữu: Địa hình/Khí hậu khắc nghiệt (Đỉnh Fansipan, đèo Hải Vân...) hoặc bất ổn xã hội dai dẳng (tệ nạn, xung đột vùng miền). Đây là các rủi ro dài hạn.
    - Nguy hiểm không thường trực: Sự kiện mới nổi lên gần đây như thiên tai (Bão lũ, ngập lụt, sạt lở), tai nạn giao thông nghiêm trọng, hoặc các chiêu trò lừa đảo, nạn chặt chém, móc túi tại điểm du lịch.

3. Định nghĩa về Hướng dẫn lộ trình di chuyển:
    - Lộ trình xa/phức tạp (trên 100km hoặc nhiều ngõ ngách): Chỉ tóm tắt sơ lược các phương tiện (máy bay, tàu hỏa, xe khách) và các điểm trung gian chiến lược. KHÔNG liệt kê chi tiết từng bước rườm rà.
    - Lộ trình gần/đơn giản (dưới 10km): Chỉ dẫn tuần tự, rõ ràng từng bước một (ví dụ: bắt xe buýt số mấy, đi bộ rẽ vào đâu).

4. Điều hướng ứng dụng Frontend (FE Router):
    - Nếu khách muốn xem thời tiết, dự báo thời tiết -> Điều hướng đến: "/weather"
    - Nếu khách muốn kiểm tra vị trí hiện tại và cần biết vị trí cụ thể trên bản đồ -> Điều hướng đến: "/safety-detail"

QUY TẮC PHẢN HỒI:
- Ngôn ngữ: TIẾNG VIỆT.
- Định dạng xuất: Bắt buộc là CHUỖI JSON HỢP LỆ (Sử dụng dấu nháy kép "). KHÔNG kèm theo lời giải thích mào đầu hoặc kết luận, KHÔNG ĐƯỢC THÊM bất kỳ thông tin gì khác ngoài thông tin được yêu cầu. Chỉ trả về duy nhất khối JSON theo cấu trúc sau:

{{
    "type": "detail" (nếu cung cấp thông tin an toàn khu vực) hoặc "navigate" (nếu hướng dẫn cách đi đường) hoặc "router" (nếu điều hướng màn hình app),
    "lat": dạng số thực 'float', chứa vĩ tuyến của vị trí được ghi nhận và cần chuyển đổi, hãy sử dụng công cụ forward_geocoding để tìm ra tọa độ địa điểm cụ thể,
    "lng": dạng số thực 'float', chứa kinh tuyến của vị trí được nhận và cần chuyển đổi, hãy sử dụng công cụ forward_geocoding để tìm ra tọa độ địa điểm cụ thể,
    "content": "Nếu type là 'router' thì ĐIỀN CHÍNH XÁC '/weather' hoặc '/safety-detail'. Nếu type là các yêu cầu khác, trả về đoạn văn ngắn khoảng 100-150 từ giải quyết chính xác nhu cầu của khách với giọng điệu dễ hiểu, chậm rãi"
    "footnote": đoạn văn ngắn khoảng 50 từ đưa ra các thông tin cần lưu ý đối với dịa điểm trên mà khách du lịch cần lưu ý khi đi đến đó
}}
"""

    full_query = f"{SYSTEM_PROMPT_VOICE_AGENT}\n\nNỘI DUNG GIỌNG NÓI CỦA KHÁCH DU LỊCH CẦN XỬ LÝ:\n\"{user_text}\""
    input = {"messages": [("user", full_query)]}
    
    # 1. Gọi Agent
    result = await agent.ainvoke(input=input)
    
    # 2. TRÍCH XUẤT ĐẦU RA THÔNG MINH (ROBUST EXTRACTION)
    # Tùy thuộc vào version LangChain/LangGraph mà Agent sẽ trả về cấu trúc khác nhau
    if isinstance(result, dict):
        if "messages" in result:
            # Chuẩn LangGraph: Kết quả là phần tử cuối cùng trong mảng messages
            output = result["messages"][-1].content
        elif "output" in result:
            # Chuẩn AgentExecutor truyền thống
            output = result["output"]
        else:
            output = str(result)
    elif hasattr(result, "content"):
        # Chuẩn AIMessage thuần
        output = result.content
    else:
        output = str(result)

    output = output.strip()
    logger.info(f"Kết quả thô từ Agent: {output}") # Ghi log để bạn dễ debug xem LLM nói gì

    # 3. LÀM SẠCH VÀ ÉP KIỂU JSON CÓ BẢO VỆ
    try:
        if "```json" in output:
            output = output.split("```json")[1].split("```")[0].strip()
        elif "```" in output:
            output = output.split("```")[1].split("```")[0].strip()

        return json.loads(output)
        
    except json.JSONDecodeError as e:
        logger.error(f"❌ Lỗi parse JSON từ LLM: {e}. Dữ liệu thô gây lỗi: {output}")
        # ⭐ FALLBACK AN TOÀN: Trả về kết quả mặc định để Backend không bao giờ bị sập (lỗi 500)
        return {
            "type": "detail",
            "lat": None,
            "lng": None,
            "content": "Xin lỗi bác, hệ thống vừa gặp chút bối rối khi tìm kiếm thông tin trên mạng. Bác có thể hỏi lại giúp cháu được không ạ?",
            "footnote": "Lỗi trích xuất dữ liệu tự động từ hệ thống tra cứu."
        }