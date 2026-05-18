import os
import tempfile
import whisper
import torch
import logging

logger = logging.getLogger(__name__)

# Tự động kiểm tra xem máy bạn có card đồ họa Nvidia (CUDA) không để tăng tốc
device = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"Đang tải mô hình Whisper 'small' chạy trên nền tảng: {device}...")

# Khởi tạo mô hình toàn cục một lần duy nhất khi khởi động server để tránh reload lặp lại
whisper_model = whisper.load_model("small", device=device)

async def transcribe_audio(audio_bytes: bytes) -> str:
    """
    Nhận dữ liệu nhị phân âm thanh, ghi ra file tạm và dịch sang văn bản tiếng Việt.
    """
    if not audio_bytes:
        return ""

    # 1. Tạo file tạm thời để lưu dữ liệu bytes âm thanh (.mp3 hoặc .m4a từ Expo)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
        tmp_file.write(audio_bytes)
        tmp_path = tmp_file.name

    try:
        # 2. Kích hoạt Whisper nhận diện, ép luồng ngôn ngữ dịch sang Tiếng Việt ('vi')
        result = whisper_model.transcribe(tmp_path, language="vi")
        transcribed_text = result.get("text", "").strip()
        return transcribed_text
        
    except Exception as e:
        logger.error(f"Lỗi trong quá trình Whisper trích xuất văn bản: {e}")
        return ""
        
    finally:
        # 3. LUÔN LUÔN dọn dẹp file tạm để bảo vệ không gian ổ đĩa máy chủ
        if os.path.exists(tmp_path):
            os.remove(tmp_path)