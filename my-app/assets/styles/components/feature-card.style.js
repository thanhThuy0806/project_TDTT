import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 28,
    padding: 20,
    paddingBottom: 30,
    marginBottom: 16,
    elevation: 8,
    boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.2)",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 12,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
});
