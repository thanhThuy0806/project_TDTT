import React from "react";
import { View, Text, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../assets/styles/components/feature-card.style";

const FeatureCard = ({ title, icon, bgColor, navigateTo }) => {
  const router = useRouter();
  const handleCardPress = () => {
    if (navigateTo) {
      router.push(navigateTo);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      activeOpacity={0.85}
      onPress={handleCardPress}
    >
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={32} color="#FFFFFF" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FeatureCard;
