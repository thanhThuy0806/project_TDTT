import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 150,
  },
  card: {
    backgroundColor: "#FFFFFF", // Card màu trắng tinh
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.25)",
    elevation: 3,
  },

  // Cover & Avatar
  coverContainer: {
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: 140,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 15,
    padding: 4,
  },
  avatarSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -40,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  topActions: {
    flexDirection: "row",
    marginTop: 50,
    gap: 8,
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 36,
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 4,
  },

  // Info Section
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DEF7EC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#059669",
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 25,
  },
  statItem: {
    alignItems: "flex-start",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 25,
    marginHorizontal: 20,
  },

  // Form
  formSection: {
    paddingHorizontal: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  rowInputs: {
    flexDirection: "row",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    height: 48,
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    paddingHorizontal: 15,
  },
  inputField: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#111827",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
    marginLeft: 6,
  },

  // Dropdown
  inputDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
  },
  dropdownText: {
    fontSize: 15,
    color: "#111827",
  },

  // Input with Prefix (Emergency Phone)
  inputWithPrefix: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    height: 48,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  prefixBox: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 15,
    height: "100%",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
  },
  prefixText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  inputFieldPrefixed: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#111827",
    paddingHorizontal: 15,
  },

  // Footer Actions
  footerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 25,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#818CFF", // Màu chủ đạo từ Tab bar
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // STYLES MỚI CHO NÚT ĐĂNG XUẤT
  logoutButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 5,
    paddingVertical: 16,
    borderRadius: 16,
    // Đổ bóng cho nút đen
    boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
    elevation: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF", // Màu chữ trắng
    fontSize: 16,
    fontWeight: "700",
  },
  // Nút Chỉnh sửa
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 10,
    gap: 8,
  },
  editButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
  },
  valueText: {
    fontSize: 16,
    color: "#374151",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 10,
    marginTop: 4,
  },
  checkBox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  tick: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
});
