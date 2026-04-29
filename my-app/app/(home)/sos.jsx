import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Animated as RNAnimated,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, RSS, Check } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { styles } from "../../assets/styles/home/sos.styles";
import {
  PlusSquare,
  Flame,
  Building2,
  Truck,
  Sword,
  Waves,
} from "lucide-react-native";

const EMERGENCY_TYPES = [
  { id: "medical", label: "Medical", icon: "PlusSquare", color: "#D4E157" },
  { id: "fire", label: "Fire", icon: "Flame", color: "#FFAB91" },
  {
    id: "disaster",
    label: "Natural disaster",
    icon: "Building2",
    color: "#A7FFEB",
  },
  { id: "accident", label: "Accident", icon: "Truck", color: "#D1C4E9" },
  { id: "violence", label: "Violence", icon: "Sword", color: "#F48FB1" },
  { id: "rescue", label: "Rescue", icon: "Waves", color: "#FFF59D" },
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function SOSScreen() {
  const [status, setStatus] = useState("idle"); // 'idle', 'counting', 'sent'
  const [countdown, setCountdown] = useState(3);
  const [selectedType, setSelectedType] = useState(null);

  const IconMap = {
    PlusSquare,
    Flame,
    Building2,
    Truck,
    Sword,
    Waves,
  };

  // Animation cho vòng tròn Progress
  const progress = useSharedValue(0);
  const CIRCLE_LENGTH = 300; // Chu vi vòng tròn
  const R = CIRCLE_LENGTH / (2 * Math.PI);

  const shakeOffset = useSharedValue(0);
  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const triggerShake = () => {
    // Hiệu ứng rung lắc UI
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 50 }), 5, true),
      withTiming(0, { duration: 50 })
    );

    // Rung vật lý điện thoại (Kiểu cảnh báo lỗi)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

  const startSOS = () => {
    if (!selectedType) {
      triggerShake(); // Chạy hiệu ứng rung lắc
      // Thay vì Alert ngắt quãng, ta có thể dùng một Text thông báo đỏ (tùy chọn)
      return;
    }

    setStatus("counting");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    progress.value = 0;
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn}>
          <ChevronLeft color="#000" size={28} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Emergency help{"\n"}needed?</Text>
        <Text style={styles.subtitle}>Press or hold the button to help</Text>

        <View style={styles.buttonContainer}>
          {/* Vòng tròn Progress shadow (chỉ hiện khi counting) */}
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

          {/* Nút bấm chính */}
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
              {status === "idle" && <RSS color="#FFF" size={40} />}
              {status === "counting" && (
                <Text style={styles.countText}>{countdown}</Text>
              )}
              {status === "sent" && <Check color="#FFF" size={45} />}
            </LinearGradient>
          </Pressable>
        </View>

        <Animated.View style={[styles.emergencySection, animatedShakeStyle]}>
          <Text
            style={[
              styles.sectionTitle,
              !selectedType && status === "idle" && { color: "#E91E63" }, // Đổi màu tiêu đề nếu chưa chọn
            ]}
          >
            What's your emergency? {!selectedType && "*"}
          </Text>

          <View style={styles.chipContainer}>
            {EMERGENCY_TYPES.map((item) => {
              const IconComponent = IconMap[item.icon];
              const isSelected = selectedType === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setSelectedType(item.id);
                    Haptics.selectionAsync();
                  }}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <View
                    style={[styles.iconCircle, { backgroundColor: item.color }]}
                  >
                    <IconComponent color="#000" size={18} />
                  </View>
                  <Text style={styles.chipLabel}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
          {!selectedType && (
            <Text style={styles.errorHint}>
              Please select a category before pressing SOS
            </Text>
          )}
        </Animated.View>

        {status === "sent" && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Email & SMS sent to{"\n"}House agent successfully
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
