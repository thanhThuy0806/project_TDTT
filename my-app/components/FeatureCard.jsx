import React from "react";
import { View, Text, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../assets/styles/components/feature-card.style";

const FeatureCard = ({
  title,
  subtitle,
  icon,
  bgColor,
  isEnabled,
  navigateTo,
}) => {
  const router = useRouter();

  const handleCardPress = () => {
    if (navigateTo) {
      router.push(navigateTo);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          // Ưu tiên sử dụng bgColor được truyền từ index.jsx để tạo sự tách biệt với nền trắng
          backgroundColor: bgColor || (isEnabled ? "#7F3DFF" : "#F9FAFB"),
          borderColor: isEnabled ? "transparent" : "#E5E7EB",
        },
      ]}
      activeOpacity={0.85}
      onPress={handleCardPress}
    >
      {/* 1. Icon Container */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isEnabled ? "rgba(255,255,255,0.25)" : "#E5E7EB" },
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isEnabled ? "#FFFFFF" : "#374151"}
        />
      </View>

      {/* 2. Text Section */}
      <View style={styles.textContainer}>
        <Text
          style={[styles.title, { color: isEnabled ? "#FFFFFF" : "#111827" }]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isEnabled ? "rgba(255,255,255,0.8)" : "#6B7280" },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FeatureCard;
