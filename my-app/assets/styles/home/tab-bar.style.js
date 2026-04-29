import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: "transparent",
    height: 60,
    zIndex: 10,
  },
  svgContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    zIndex: 1,
    boxShadow: "0px -3px 15px rgba(0,0,0,0.08)",
    elevation: 10,
  },
});
