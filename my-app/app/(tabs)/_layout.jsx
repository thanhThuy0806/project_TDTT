import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "lucide-react-native";

const TabsLayout = () => {
  return (
    <LinearGradient colors={["#F0F4FF", "#E6F9F0"]} style={styles.gradientBg}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#818CFF",
            tabBarInactiveTintColor: "#B0B3C6",
            tabBarShowLabel: false, // ẩn chữ ở đây
            tabBarItemStyle: {
              justifyContent: "center", // Canh giữa theo chiều dọc (Trục Y)
              alignItems: "center", // Canh giữa theo chiều ngang (Trục X)
            },

            tabBarStyle: {
              position: "absolute",
              bottom: 25,
              left: 20,
              right: 20,
              height: 70, // Chiều cao cố định
              backgroundColor: "#FFFFFF",
              borderRadius: 35,
              borderTopWidth: 0,
              paddingTop: 10,
              paddingBottom: 0,

              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.08,
              shadowRadius: 20,
              elevation: 10,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Khám phá",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" size={28} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="voice"
            options={{
              title: "Thời tiết",
              tabBarIcon: ({color}) => <Ionicons name="mic-outline" size={26} color={color}/>,
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: "Hồ sơ",
              tabBarIcon: ({ color }) => (
                <Ionicons name="man" size={26} color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default TabsLayout;
