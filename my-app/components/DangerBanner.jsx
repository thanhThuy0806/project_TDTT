import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
import { styles } from "../assets/styles/components/danger-banner.style";
import * as Location from "expo-location";
import { API_URL } from "@/constants/api";

export default function DangerBanner({
  isDanger: initialIsDanger = false,
  dangerDetails: initialDangerDetails = [],
}) {
  const [expanded, setExpanded] = useState(false);

  const [isDanger, setIsDanger] = useState(initialIsDanger);
  const [dangerDetails, setDangerDetails] = useState(initialDangerDetails);

  const ws = useRef(null);
  const locationSubscription = useRef(null); // Sử dụng lại ref để lưu subscription

  const shakeTranslation = useSharedValue(0);
  const dangerProgress = useSharedValue(isDanger ? 1 : 0);

  useEffect(() => {
    dangerProgress.value = withTiming(isDanger ? 1 : 0, { duration: 500 });

    if (isDanger) {
      shakeTranslation.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 100 }),
          withTiming(2, { duration: 100 }),
        ),
        -1,
        true,
      );

      const timer = setTimeout(() => {
        shakeTranslation.value = withTiming(0, { duration: 200 });
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      shakeTranslation.value = 0;
      setExpanded(false);
    }
  }, [isDanger]);

  useEffect(() => {
    const BACKEND_WS_URL = `ws://${API_URL}:8000/warning/ws/tracking`;

    ws.current = new WebSocket(BACKEND_WS_URL);

    ws.current.onopen = () => {
      console.log("Đã kết nối WebSocket tới server.");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setIsDanger(data.is_danger);

        if (data.is_danger && data.alerts && data.alerts.length > 0) {
          const alertsList = data.alerts.map((a) => a.text);
          setDangerDetails(alertsList);
        } else if (data.alertText) {
          setDangerDetails([data.alertText]);
        } else {
          setDangerDetails([]);
        }
      } catch (error) {
        console.error("Lỗi xử lý dữ liệu từ Server:", error);
      }
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket Lỗi:", error.message);
    };

    let isMounted = true;

    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Quyền truy cập vị trí bị từ chối");
        return;
      }

      // Khôi phục sử dụng watchPositionAsync
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000, // Cập nhật sau mỗi 30 giây
          distanceInterval: 15, // Hoặc cập nhật khi di chuyển đủ 15 mét
        },
        (location) => {
          if (!isMounted) return;
          
          const coords = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };
          
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(coords));
          }
          
          console.log(
            `lattitude: ${location.coords.latitude}\nlongitude: ${location.coords.longitude}`,
          );
        }
      );
    };

    startTracking();

    return () => {
      isMounted = false;

      if (ws.current) {
        ws.current.close();
      }

      // Xử lý an toàn lỗi removeSubscription của Expo SDK 50
      if (locationSubscription.current) {
        try {
          locationSubscription.current.remove();
        } catch (error) {
          console.warn("Bỏ qua lỗi ngắt kết nối GPS của Expo:", error.message);
        }
      }
    };
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      dangerProgress.value,
      [0, 1],
      ["#E8F5E9", "#FFCDD2"],
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
              {isDanger ? "Cảnh báo nguy hiểm!" : "Khu vực an toàn"}
            </Text>
            <Text style={styles.subtitle}>
              {isDanger
                ? "Bạn đang ở vùng có nguy cơ cao. Hãy cẩn trọng!"
                : "Mọi thứ đều ổn, bạn có thể thoải mái khám phá!"}
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
              <Text style={styles.setNowText}>Không phát hiện nguy hiểm</Text>
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