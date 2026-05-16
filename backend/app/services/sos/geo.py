from math import radians, cos, sin, asin, sqrt

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Tính khoảng cách đường chim bay giữa 2 điểm (Km).
    Giữ nguyên độ chính xác thập phân để phục vụ thuật toán tìm vị trí gần nhất.
    """
    R = 6371.0088

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * asin(sqrt(a))

    return R * c 