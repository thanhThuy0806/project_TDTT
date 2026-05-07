import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F2", // Màu nền hơi hồng cam nhạt theo ảnh
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 60,
  },
  buttonContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
    transform: [{ rotate: "-90deg" }],
    width: 200,
    height: 200,
  },
  mainButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    elevation: 15,
    boxShadow: "0px 10px 15px rgba(91,12,39,0.3)",
    backgroundColor: "#FFF",
  },
  gradient: {
    flex: 1,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF",
  },
  successContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  successText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  doneBtn: {
    width: 120,
    height: 45,
    borderRadius: 10,
    overflow: "hidden",
  },
  doneGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  doneText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  emergencySection: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    // Đổ bóng nhẹ cho chip
    boxShadow: "0px 2px 5px rgba(0,0,0,0.05)",
    elevation: 2,
  },
  chipSelected: {
    borderColor: "#E91E63",
    backgroundColor: "#FFF0F5",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  errorHint: {
    color: "#E91E63",
    fontSize: 12,
    marginTop: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 15,
  },
});
