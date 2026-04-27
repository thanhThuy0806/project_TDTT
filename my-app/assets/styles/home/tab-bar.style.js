import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: 'transparent', // Quan trọng: Phải trong suốt để thấy nền SVG
    borderTopWidth: 0,
    height: 60,
    zIndex: 10,
  },
  svgContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    zIndex: 1,                     // Đặt thấp hơn tab bar
    // Đổ bóng viền tinh tế cho toàn bộ thanh Tab Bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 10, 
  }
});