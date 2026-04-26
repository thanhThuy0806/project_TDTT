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

  // STYLING CHÍNH: HIỂN THỊ NHIỆT KẾ MỚI (Thay thế hoàn toàn)
  thermometerDisplayContainer: {
    alignItems: "center",
    marginVertical: 40,
    width: "100%",
    height: 350,
    justifyContent: "center",
  }, // Tăng chiều cao để đủ chỗ cho viền mới
  thermometerValueText: {
    fontSize: 56,
    fontWeight: "bold",
    marginBottom: 15,
    letterSpacing: -1,
  },
  celsiusText: { fontSize: 24, fontWeight: "normal", color: "#999" },

  // Viền ngoài bóng mờ cho toàn bộ cấu trúc (Tạo hiệu ứng Glassmorphism như ảnh mẫu)
  thermometerOuterFrame: {
    width: 70, // Đủ rộng cho bầu lớn và viền mờ
    height: 260, // Đủ cao cho ống và bầu
    backgroundColor: "#FFFFFF", // Nền trắng bên trong viền mờ
    borderRadius: 35, // Bo góc cho khung ngoài mờ mờ
    borderWidth: 1,
    borderColor: "#E0E0E0", // Viền xám mờ nhẹ
    paddingHorizontal: 10,
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    // Hiệu ứng Glassmorphism nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1, // Shadow cho Android
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
