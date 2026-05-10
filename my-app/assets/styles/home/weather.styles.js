import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
  },
  iconBtn: {
    padding: 10,
    backgroundColor: "#F7F8FA",
    borderRadius: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: "center",
    paddingBottom: 40,
  },
  // infoWrap: {
  //   width: "100%",
  //   gap: 12,
  //   marginTop: 20,
  // },
  // infoCard: {
  //   backgroundColor: "#F7F8FA",
  //   borderRadius: 24,
  //   padding: 16,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  // infoLeft: {
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // infoIcon: {
  //   backgroundColor: "#FFF",
  //   padding: 10,
  //   borderRadius: 18,
  //   marginRight: 12,
  // },
  // infoTitle: {
  //   fontSize: 15,
  //   color: "#555",
  //   fontWeight: "500",
  // },
  // infoValue: {
  //   fontSize: 17,
  //   fontWeight: "700",
  // },
  // bottomBar: {
  //   flexDirection: "row",
  //   backgroundColor: "#F7F8FA",
  //   width: "100%",
  //   padding: 15,
  //   borderRadius: 30,
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
  // fanSection: { flexDirection: "row", alignItems: "center" },
  // fanIconBg: {
  //   backgroundColor: "#fff",
  //   padding: 10,
  //   borderRadius: 20,
  //   marginRight: 15,
  // },
  // fanText: {
  //   fontSize: 16,
  //   color: "#5C6BC0",
  //   fontWeight: "500",
  // },
  // qualityValue: {
  //   fontSize: 16,
  //   fontWeight: "600",
  //   color: "#333",
  // },

  unifiedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIconBg: {
    backgroundColor: "#F7F8FA",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 17,
    fontWeight: "700",
  },
  forecastSection: {
    width: "100%",
    marginTop: 20,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  dayCard: {
    backgroundColor: "#F7F8FA",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    textTransform: "capitalize",
  },
  dayDesc: {
    marginTop: 4,
    color: "#666",
  },
  dayRight: {
    alignItems: "flex-end",
  },
  tempHigh: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  tempLow: {
    fontSize: 15,
    color: "#777",
  },
  rainText: {
    marginTop: 4,
    color: "#4FC3F7",
  },
  adviceBox: {
    width: "100%",
    backgroundColor: "#FFF8E1",
    borderRadius: 22,
    padding: 16,
    marginTop: 16,
    marginBottom: 40,
  },
  adviceText: {
    fontSize: 14,
    color: "#6D4C41",
    marginBottom: 6,
    lineHeight: 22,
  },
});
