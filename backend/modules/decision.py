# decision.py: Lớp đưa ra quyết định
# Chuyển score thành thông báo cho user

def make_decision(score):
    #Args:
    #    score (float): từ 0 → 1

    # Returns:
    #        str: thông báo cảnh báo

    if score > 0.8:
        return "CẢNH BÁO NGUY HIỂM"
    elif score > 0.5:
        return "CẢNH BÁO TRUNG BÌNH"
    else:
        return "THỜI TIẾT BÌNH THƯỜNG"