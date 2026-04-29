import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 20, marginBottom: 20 },
  container: {
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
  },
  mainRow: { flexDirection: "row", alignItems: "center" },
  textSection: { flex: 1.5, paddingRight: 10 },
  imageSection: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 },
  subtitle: { fontSize: 13, color: "#555", lineHeight: 18, marginBottom: 12 },
  setNowBtn: {
    backgroundColor: "#4E342E",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  setNowText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  toggleBtn: { flexDirection: "row", alignItems: "center" },
  toggleText: { color: "#B71C1C", fontWeight: "700", marginRight: 4 },
  dangerList: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  dangerItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  dangerItemText: {
    marginLeft: 8,
    color: "#B71C1C",
    fontSize: 13,
    fontWeight: "500",
  },
});
