from .goong_service import get_location_info
import re

async def process_intent(text: str):
    text = text.lower().strip()
    
    # 1. Kiểm tra tìm đường
    if any(k in text for k in ["đường đến", "chỉ đường", "tới", "đi đến", "navigate to"]):
        # Trích xuất địa danh bằng cách xóa các từ khóa
        destination = re.sub(r'(đường đến|chỉ đường|tới|đi đến|navigate to)', '', text).strip()
        if destination:
            return {
                "action": "NAVIGATE",
                "text": f"Đang tìm đường đến {destination.title()}",
                "data": destination
            }
    
    # 2. Kiểm tra thông tin địa danh
    location_result = get_location_info(text)
    if location_result:
        return location_result
            
    # 3. Mặc định: Không hỗ trợ
    return {
        "action": "NONE",
        "text": "Hệ thống không hỗ trợ yêu cầu này.",
        "data": None
    }