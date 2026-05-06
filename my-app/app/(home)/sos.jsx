import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Rss, Check } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { styles } from "../../assets/styles/home/sos.styles";
import { Ionicons } from "@expo/vector-icons";

const EMERGENCY_TYPES = [
  { id: "medical", label: "Y tế", icon: "medkit", color: "#D4E157" },
  { id: "fire", label: "Hỏa hoạn", icon: "flame", color: "#FFAB91" },
  {
    id: "disaster",
    label: "Thiên tai",
    icon: "business",
    color: "#A7FFEB",
  },
  { id: "accident", label: "Tai nạn", icon: "car", color: "#D1C4E9" },
  { id: "violence", label: "Bạo lực", icon: "shield", color: "#F48FB1" },
  { id: "rescue", label: "Cứu hộ", icon: "water", color: "#FFF59D" },
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function SOSScreen() {
  const router = useRouter();
  const [status, setStatus] = useState("idle"); // 'idle', 'counting', 'sent'
  const [countdown, setCountdown] = useState(3);
  const [selectedType, setSelectedType] = useState(null);

  // Animation
  const progress = useSharedValue(0);
  const CIRCLE_LENGTH = 300;
  const R = CIRCLE_LENGTH / (2 * Math.PI);

  const shakeOffset = useSharedValue(0);

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const startSOS = () => {
    if (!selectedType) {
      triggerShake();
      return;
    }

    setStatus("counting");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    progress.value = withTiming(1, { duration: 3000, easing: Easing.linear });

    let timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus("sent");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDone = () => {
    setStatus("idle");
    setCountdown(3);
    progress.value = 0;
    setSelectedType(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#000" size={28} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Hỗ Trợ Khẩn Cấp{"\n"}needed?</Text>
        <Text style={styles.subtitle}>Nhấn hoặc giữ nút để gửi tín hiệu</Text>

        <View style={styles.buttonContainer}>
          {status === "counting" && (
            <Svg style={styles.svg}>
              <Circle
                cx="100"
                cy="100"
                r={R}
                stroke="#F0EAE5"
                strokeWidth="15"
                fill="transparent"
              />
              <AnimatedCircle
                cx="100"
                cy="100"
                r={R}
                stroke="#E91E63"
                strokeWidth="15"
                fill="transparent"
                strokeDasharray={CIRCLE_LENGTH}
                animatedProps={animatedProps}
                strokeLinecap="round"
              />
            </Svg>
          )}

          {/* Nút SOS chính */}
          <Pressable
            onPress={status === "idle" ? startSOS : null}
            style={({ pressed }) => [
              styles.mainButton,
              pressed && status === "idle" && { transform: [{ scale: 0.95 }] },
            ]}
          >
            <LinearGradient
              colors={["#FF8A65", "#E91E63"]}
              style={styles.gradient}
            >
              {status === "idle" && <Rss color="#FFF" size={40} />}
              {status === "counting" && (
                <Text style={styles.countText}>{countdown}</Text>
              )}
              {status === "sent" && <Check color="#FFF" size={45} />}
            </LinearGradient>
          </Pressable>
        </View>

        {/* Phần chọn loại sự cố */}
        <Animated.View style={[styles.emergencySection, animatedShakeStyle]}>
          <Text
            style={[
              styles.sectionTitle,
              !selectedType && status === "idle" && { color: "#E91E63" },
            ]}
          >
            Tình trạng hiện tại của bạn như thế nào?{" "}
            {!selectedType && status === "idle" && "*"}
          </Text>

          <View style={styles.chipContainer}>
            {EMERGENCY_TYPES.map((item) => {
              const isSelected = selectedType === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    if (status === "idle") {
                      setSelectedType(item.id);
                      Haptics.selectionAsync();
                    }
                  }}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <View
                    style={[styles.iconCircle, { backgroundColor: item.color }]}
                  >
                    <Ionicons name={item.icon} color="#000" size={18} />
                  </View>
                  <Text style={styles.chipLabel}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {!selectedType && status === "idle" && (
            <Text style={styles.errorHint}>
              Vui lòng chọn trường hợp cứu trợ
            </Text>
          )}
        </Animated.View>

        {/* Thông báo thành công */}
        {status === "sent" && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Email & SMS đã gửi đến{"\n"}các đơn vị hỗ trợ thành công
            </Text>
            <Pressable style={styles.doneBtn} onPress={handleDone}>
              <LinearGradient
                colors={["#FF8A65", "#E91E63"]}
                style={styles.doneGradient}
              >
                <Text style={styles.doneText}>Done</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
