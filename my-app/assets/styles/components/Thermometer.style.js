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
    boxShadow: "0px 4px 8px rgba(31,66,84,0.4)",
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
