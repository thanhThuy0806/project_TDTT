import React from "react";
import { View, Dimensions } from "react-native";
import { Tabs } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import FloatingBarButton from "../../components/FloatingBarButton";
import { styles } from "../../assets/styles/home/tab-bar.style";

const { width } = Dimensions.get("window");

const TabBarBackground = () => {
  const center = width / 2;
  // Công thức đường cong lún
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
    <View style={styles.svgContainer}>
      <Svg width={width} height={80}>
        <Path d={d} fill="#FFFFFF" />
      </Svg>
    </View>
  );
};

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#111827",
          tabBarInactiveTintColor: "#6B7280",
        }}
      >
        {/* Tab 1: Trang chủ */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={26}
                color={color}
              />
            ),
          }}
        />

        {/* Tab 2: Nút Floating */}
        <Tabs.Screen
          name="voice"
          options={{
            tabBarButton: (props) => <FloatingBarButton {...props} />,
          }}
        />

        {/* Tab 3: Cá nhân */}
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={26}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <TabBarBackground />
    </View>
  );
}
