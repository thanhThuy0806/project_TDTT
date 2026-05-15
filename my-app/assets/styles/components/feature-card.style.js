import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 28,
    padding: 20,
    paddingBottom: 30,
    marginBottom: 16,
    // Hiệu ứng shadow hiện đại
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)", // Nền mờ đục trắng
    justifyContent: "center",
    alignItems: "flex-start", // Căn trái icon bên trong
    paddingLeft: 12,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "flex-start", // Căn trái chữ
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF", // Chữ trắng nổi bật trên nền màu mạnh
    letterSpacing: -0.5,
  },
});
