import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    top: -40, // Đẩy nút lên nhẹ khỏi phần lún
    justifyContent: 'center',
    alignItems: 'center',
    // Bóng đổ cao cấp tạo độ nổi cho nút
    shadowColor: "#7f56c4", // Màu bóng đồng màu với nút
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8a62cf', // Màu nền tím
    justifyContent: 'center',
    alignItems: 'center',
  },
});