import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolateColor,
} from "react-native-reanimated";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react-native";

export default function DangerBanner({ isDanger, dangerDetails }) {
  const [expanded, setExpanded] = React.useState(false);

  // Animation value cho độ rung và màu sắc
  const shakeTranslation = useSharedValue(0);
  const dangerProgress = useSharedValue(isDanger ? 1 : 0);

  useEffect(() => {
    dangerProgress.value = withTiming(isDanger ? 1 : 0, { duration: 500 });

    if (isDanger) {
      // Tạo hiệu ứng rung nhẹ liên tục khi có nguy hiểm
      shakeTranslation.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 100 }),
          withTiming(2, { duration: 100 })
        ),
        -1, // Lặp vô hạn
        true // Chạy ngược lại
      );
    } else {
      shakeTranslation.value = 0;
      setExpanded(false);
    }
  }, [isDanger]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      dangerProgress.value,
      [0, 1],
      ["#E8F5E9", "#FFCDD2"] // Màu xanh lá nhạt (bình thường) -> Đỏ nhạt (nguy hiểm)
    );

    return {
      backgroundColor,
      transform: [{ translateX: shakeTranslation.value }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <View style={styles.mainRow}>
          <View style={styles.textSection}>
            <Text style={styles.title}>
              {isDanger ? "Cảnh báo nguy hiểm!" : "Set the reminder"}
            </Text>
            <Text style={styles.subtitle}>
              {isDanger
                ? "Bạn đang ở vùng có nguy cơ cao. Hãy cẩn trọng!"
                : "Never miss your morning routine! Set a reminder to stay on track"}
            </Text>

            {isDanger ? (
              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => setExpanded(!expanded)}
              >
                <Text style={styles.toggleText}>Xem chi tiết</Text>
                {expanded ? (
                  <ChevronUp size={16} color="#B71C1C" />
                ) : (
                  <ChevronDown size={16} color="#B71C1C" />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.setNowBtn}>
                <Text style={styles.setNowText}>Set Now</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.imageSection}>
            <Bell
              size={60}
              color={isDanger ? "#B71C1C" : "#E65100"}
              strokeWidth={1.5}
            />
          </View>
        </View>

        {/* Phần hiển thị nguy hiểm khi toggle */}
        {isDanger && expanded && (
          <View style={styles.dangerList}>
            {dangerDetails.map((item, index) => (
              <View key={index} style={styles.dangerItem}>
                <AlertTriangle size={14} color="#B71C1C" />
                <Text style={styles.dangerItemText}>{item}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
