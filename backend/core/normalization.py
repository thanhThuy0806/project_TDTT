# normalization.py: Chuẩn hóa dữ liệu (Z-score normalization)
# Mục tiêu:
# - Đưa các đại lượng khác nhau về cùng scale
# - Giúp hệ thống decision hoạt động ổn định hơn
# Công thức: Z = (x - mean) / std

def z_score_normalize(value, mean, std):
# Chuẩn hóa Z-score
#   Args:
#       value (float): giá trị đầu vào
#       mean (float): giá trị trung bình
#       std (float): độ lệch chuẩn
#   Returns:
#       float: giá trị đã chuẩn hóa

    if std == 0:
        return 0

    return (value - mean) / std