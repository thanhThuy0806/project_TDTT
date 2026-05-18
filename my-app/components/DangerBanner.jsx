import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
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
import { useTrackingStore } from "@/store/useTrackingStore"; 
import { styles } from "../assets/styles/components/danger-banner.style";
import * as Location from "expo-location";
import { API_URL } from "../services/apiClient";

export default function DangerBanner({
  isDanger: initialIsDanger = false,
  dangerDetails: initialDangerDetails = [],
}) {
  const [expanded, setExpanded] = useState(false);
  const [isDanger, setIsDanger] = useState(initialIsDanger);
  const [dangerDetails, setDangerDetails] = useState(initialDangerDetails);
  
  // Sử dụng global state từ Zustand
  const isTracking = useTrackingStore((state) => state.isTracking);
  const toggleTracking = useTrackingStore((state) => state.toggleTracking);

  const ws = useRef(null);
  const locationSubscription = useRef(null);

  const shakeTranslation = useSharedValue(0);
  const dangerProgress = useSharedValue(isDanger ? 1 : 0);

  useEffect(() => {
    const shouldShowDanger = isTracking && isDanger;
    
    dangerProgress.value = withTiming(shouldShowDanger ? 1 : 0, { duration: 500 });

    if (shouldShowDanger) {
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
  }, [isDanger, isTracking]);

  useEffect(() => {
    if (!isTracking) {
      setIsDanger(false);
      setDangerDetails([]);
      return;
    }

    const BACKEND_WS_URL = `ws://${API_URL}/warning/ws/tracking`;
    console.log(`backend: ${BACKEND_WS_URL}`)

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
      console.log("WebSocket lỗi:", error.message);
    };

    let isMounted = true;

    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Quyền truy cập vị trí bị từ chối");
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 600000, 
          distanceInterval: 3000, 
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

      if (locationSubscription.current) {
        try {
          locationSubscription.current.remove();
        } catch (error) {
          console.warn("Bỏ qua lỗi ngắt kết nối GPS của Expo:", error.message);
        }
      }
    };
  }, [isTracking]);

  // XỬ LÝ WEBSOCKET VÀ LOCATION TRACKING
  useEffect(() => {
    // THAY ĐỔI ĐỊA CHỈ IP NÀY BẰNG IP IPv4 CỦA MÁY TÍNH TRÊN MẠNG WIFI
    // Ví dụ: "ws://192.168.1.10:8000/ws/tracking"
    const BACKEND_WS_URL = `ws://${API_URL}/warning/ws/tracking`;

    // Khởi tạo kết nối WebSocket
    ws.current = new WebSocket(BACKEND_WS_URL);

    ws.current.onopen = () => {
      console.log("Đã kết nối WebSocket tới server.");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Khớp với response trả về từ app.py: data.is_danger, data.alerts
        setIsDanger(data.is_danger);

        if (data.is_danger && data.alerts && data.alerts.length > 0) {
          // Map mảng alerts (đối tượng) thành mảng chuỗi (text) để in ra UI
          const alertsList = data.alerts.map((a) => a.text);
          setDangerDetails(alertsList);
        } else if (data.alertText) {
          // Fallback backward compatibility từ backend
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

    // Bắt đầu theo dõi vị trí
    const startTracking = async () => {
      // Xin quyền sử dụng GPS (Bắt buộc trên Native App)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Quyền truy cập vị trí bị từ chối");
        return;
      }

      // Theo dõi vị trí và gửi qua WebSocket
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced, // Tiết kiệm pin, đủ dùng cho cảnh báo vùng
          timeInterval: 600000, 
          distanceInterval: 1500,
        },
        (location) => {
          const coords = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };

          // Nếu Websocket đang mở, bắn tọa độ xuống Backend
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(coords));
          }
          console.log(
            `lattitude: ${location.coords.latitude}\nlongitude: ${location.coords.longitude}`,
          );
        },
      );
    };

    startTracking();

    // Dọn dẹp tài nguyên khi Component unmount (đổi màn hình hoặc đóng app)
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  // 3. RENDER UI (Giữ nguyên hoàn toàn cấu trúc UI của bạn)
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
      <Animated.View 
        style={[
          styles.container, 
          animatedContainerStyle,
          !isTracking && { opacity: 0.6, backgroundColor: '#F5F5F5' } 
        ]}
      >
        <View style={styles.mainRow}>
          <View style={styles.textSection}>
            <Text style={styles.title}>
              {!isTracking 
                ? "Đã tắt cảnh báo" 
                : (isDanger ? "Cảnh báo nguy hiểm!" : "Khu vực an toàn")}
            </Text>
            <Text style={styles.subtitle}>
              {!isTracking
                ? "Hệ thống đang tạm ngừng theo dõi vị trí của bạn."
                : (isDanger
                  ? "Bạn đang ở vùng có nguy cơ cao. Hãy cẩn trọng!"
                  : "Mọi thứ đều ổn, bạn có thể thoải mái khám phá!")}
            </Text>

            {isDanger && isTracking ? (
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
              <Text style={styles.setNowText}>
                {isTracking ? "Không phát hiện nguy hiểm" : "Hiện không hoạt dộng"}
              </Text>
            )}
          </View>

          <View style={styles.imageSection}>
            <Bell
              size={60}
              color={!isTracking ? "#9E9E9E" : (isDanger ? "#B71C1C" : "#E65100")}
              strokeWidth={1.5}
            />
          </View>
        </View>

        {isDanger && expanded && isTracking && (
          <View style={styles.dangerList}>
            {dangerDetails.map((item, index) => (
              <View key={index} style={styles.dangerItem}>
                <AlertTriangle size={14} color="#B71C1C" />
                <Text style={styles.dangerItemText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ width: '100%', alignItems: 'flex-end', marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: '#757575', marginRight: 8, fontWeight: '500' }}>
              {isTracking ? "Đang quét an toàn" : "Tắt theo dõi"}
            </Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#91aaef" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
              onValueChange={toggleTracking} // Sử dụng hàm toggle từ Zustand
              value={isTracking}
              style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            />
          </View>
        </View>

      </Animated.View>
    </View>
  );
}