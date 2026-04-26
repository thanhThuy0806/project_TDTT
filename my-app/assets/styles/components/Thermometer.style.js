import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 16,
  },
  halo: {
    position: "absolute",
    backgroundColor: "rgba(173,216,255,0.18)",
  },
  tube: {
    borderColor: "rgba(255,255,255,0.7)",
    overflow: "hidden",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  bulb: {
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4fa8d5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "700",
    color: "#1e88e5",
    letterSpacing: 0.5,
  },
});
