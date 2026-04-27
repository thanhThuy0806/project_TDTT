import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#2D3436" },
  iconBtn: { padding: 10, backgroundColor: "#F7F8FA", borderRadius: 15 },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: "center",
    paddingBottom: 40,
  },

  // Styling Grid và BottomBar (Giữ nguyên - Rất đẹp)
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  statCard: {
    width: "31%",
    paddingVertical: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: { fontSize: 14, color: "#666", marginTop: 10 },
  statValue: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#F7F8FA",
    width: "100%",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  fanSection: { flexDirection: "row", alignItems: "center" },
  fanIconBg: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginRight: 15,
  },
  fanText: { fontSize: 16, color: "#5C6BC0", fontWeight: "500" },
  qualityValue: { fontSize: 16, fontWeight: "600", color: "#333" },
  testControl: { flexDirection: "row", marginTop: 30, gap: 20 },
  testBtn: { backgroundColor: "#CCC", padding: 10, borderRadius: 10 },
});
