import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Tabs } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import VoiceInteractionButton from "../../components/VoiceInteractionButton";
const { width } = Dimensions.get("window");

const TabBarBackground = ({ animatedStyle }) => {
  const center = width / 2;
  const d = `
    M 0 0
    L ${center - 45} 0
    C ${center - 20} 0, ${center - 30} 20, ${center} 20
    C ${center + 30} 20, ${center + 20} 0, ${center + 45} 0
    L ${width} 0
    L ${width} 80
    L 0 80
    Z
  `;

  return (
    <Animated.View style={[styles.svgContainer, animatedStyle]}>
      <Svg width={width} height={80}>
        <Path d={d} fill="#FFFFFF" />
      </Svg>
    </Animated.View>
  );
};

export default function TabLayout() {
  // Biến trạng thái: True = Đang thu âm, False = Tắt
  const isRecording = useSharedValue(false);

  // Animation đẩy toàn bộ Tab Bar và nền cong xuống dưới 120px
  const tabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isRecording.value ? 120 : 0, {
            duration: 350,
          }),
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        // Bọc Tab Bar mặc định bằng Animated.View để xử lý trượt
        tabBar={(props) => (
          <Animated.View style={[styles.tabBar, tabAnimatedStyle]}>
            {/* Không cần truyền style vào đây nữa, nó sẽ tự đọc từ screenOptions */}
            <BottomTabBar {...props} />
          </Animated.View>
        )}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#111827",
          tabBarInactiveTintColor: "#6B7280",

          tabBarStyle: {
            backgroundColor: "transparent", // Xóa nền trắng
            borderTopWidth: 0, // Xóa viền mờ bên trên
            elevation: 0, // Xóa bóng đổ mặc định trên Android
            shadowOpacity: 0, // Xóa bóng đổ mặc định trên iOS
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={26}
                color={color}
                style={{
                  bottom: 20,
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="voice"
          options={{ tabBarButton: () => <View style={{ width: 60 }} /> }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={26}
                color={color}
                style={{
                  bottom: 20,
                }}
              />
            ),
          }}
        />
      </Tabs>

      <TabBarBackground animatedStyle={tabAnimatedStyle} />
      <VoiceInteractionButton isRecording={isRecording} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 10,
  },
  svgContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 10,
  },
});
