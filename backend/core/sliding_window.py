# sliding_window.py: Cơ chế Sliding Window
# Mục tiêu:
# - Làm mượt dữ liệu (giảm nhiễu)
# - Giống cách hệ thống realtime xử lý sensor

from collections import deque

class SlidingWindow:
    def __init__(self, size):
        # Args:
        #     size (int): kích thước window
        self.window = deque(maxlen=size)

    def add(self, value):
        # Thêm giá trị mới vào window
        self.window.append(value)

    def average(self):
        # Tính trung bình của window
        if not self.window:
            return 0
        return sum(self.window) / len(self.window)