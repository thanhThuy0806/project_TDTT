import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    // Đổ bóng giúp thẻ nổi khối rõ rệt so với nền
    boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
    elevation: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  switchContainer: {
    alignItems: "flex-start",
    marginLeft: -8,
  },
});
