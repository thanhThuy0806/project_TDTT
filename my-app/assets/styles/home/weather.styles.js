import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitleContainer: {
    alignItems: "center", // Căn giữa nội dung văn bản
    flex: 1,
  },
  locationText: {
    fontSize: 22,
    fontWeight: "800", // Đậm hơn để nổi bật
    color: "#2D3436",
    letterSpacing: 0.5,
  },
  dateText: {
    color: "rgba(45, 52, 54, 0.7)", // Dùng màu tối mờ để dễ đọc trên nền sáng
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)", // Hiệu ứng gương mờ cho nút back
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    // alignItems: "center",
    // paddingBottom: 40,
  },
  mainWeather: {
    alignItems: "center",
    marginVertical: 30,
  },
  conditionText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 5,
  },
  mainTemp: {
    color: "#fff",
    fontSize: 80,
    fontWeight: "300",
  },
  minMaxContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  minMaxText: {
    color: "#fff",
    fontSize: 18,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  adviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  orangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF7043",
    marginRight: 10,
  },
  adviceText: {
    color: "#555",
    fontSize: 14,
  },
  detailsGrid: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F5F6FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailLabel: {
    fontSize: 12,
    color: "#888",
  },
  forecastSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  forecastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  forecastDayName: {
    fontSize: 15,
    fontWeight: "600",
    width: 50,
  },
  forecastCondition: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    marginLeft: 10,
  },
  forecastTempRange: {
    flexDirection: "row",
    alignItems: "center",
  },
  forecastTempHigh: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  forecastTempLow: {
    fontSize: 16,
    color: "#999",
  },
});
