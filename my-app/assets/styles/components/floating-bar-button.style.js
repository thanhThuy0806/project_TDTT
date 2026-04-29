import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    top: -40, // Đẩy nút lên nhẹ khỏi phần lún
    justifyContent: "center",
    alignItems: "center",
    // Bóng đổ cao cấp tạo độ nổi cho nút
    boxShadow: "0px 8px 12px rgba(50,34,77,0.3)",
    elevation: 8,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8a62cf", // Màu nền tím
    justifyContent: "center",
    alignItems: "center",
  },
});
