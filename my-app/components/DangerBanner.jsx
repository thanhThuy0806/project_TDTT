<<<<<<< HEAD
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
=======
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
>>>>>>> BE_Weather
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
<<<<<<< HEAD
import * as Location from 'expo-location'; // Import thư viện lấy vị trí của Expo

// Đổi tên props thành initial để sử dụng state nội bộ cho realtime
export default function DangerBanner({ isDanger: initialIsDanger = false, dangerDetails: initialDangerDetails = [] }) {
  const [expanded, setExpanded] = useState(false);
  
  // State quản lý dữ liệu realtime
  const [isDanger, setIsDanger] = useState(initialIsDanger);
  const [dangerDetails, setDangerDetails] = useState(initialDangerDetails);

  // Refs để quản lý kết nối và theo dõi vị trí tránh memory leak
  const ws = useRef(null);
  const locationSubscription = useRef(null);
=======

export default function DangerBanner({ isDanger, dangerDetails }) {
  const [expanded, setExpanded] = React.useState(false);
>>>>>>> BE_Weather

  // Animation value cho độ rung và màu sắc
  const shakeTranslation = useSharedValue(0);
  const dangerProgress = useSharedValue(isDanger ? 1 : 0);

<<<<<<< HEAD
  // 1. EFFECT XỬ LÝ ANIMATION (Giữ nguyên của bạn)
=======
>>>>>>> BE_Weather
  useEffect(() => {
    dangerProgress.value = withTiming(isDanger ? 1 : 0, { duration: 500 });

    if (isDanger) {
<<<<<<< HEAD
=======
      // Tạo hiệu ứng rung nhẹ liên tục khi có nguy hiểm
>>>>>>> BE_Weather
      shakeTranslation.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 100 }),
          withTiming(2, { duration: 100 })
        ),
        -1,
        true
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

<<<<<<< HEAD
  // 2. EFFECT MỚI: XỬ LÝ WEBSOCKET VÀ LOCATION TRACKING
  useEffect(() => {
    // THAY ĐỔI ĐỊA CHỈ IP NÀY BẰNG IP IPv4 CỦA MÁY TÍNH TRÊN MẠNG WIFI
    // Ví dụ: "ws://192.168.1.10:8000/ws/tracking"
    const BACKEND_WS_URL = "ws://192.168.88.221:8000/ws/tracking"; 

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
          const alertsList = data.alerts.map(a => a.text);
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
      if (status !== 'granted') {
        console.warn('Quyền truy cập vị trí bị từ chối');
        return;
      }

      // Theo dõi vị trí và gửi qua WebSocket
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced, // Tiết kiệm pin, đủ dùng cho cảnh báo vùng
          timeInterval: 60000, // Cập nhật mỗi 60 giây (Tùy chỉnh để tránh spam Backend)
          distanceInterval: 50, // Hoặc gửi khi di chuyển được 15 mét
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
          console.log(`lattitude: ${location.coords.latitude}\nlongitude: ${location.coords.longitude}`)
        }
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
=======
>>>>>>> BE_Weather
  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      dangerProgress.value,
      [0, 1],
<<<<<<< HEAD
      ["#E8F5E9", "#FFCDD2"] 
=======
      ["#E8F5E9", "#FFCDD2"] // Màu xanh lá nhạt (bình thường) -> Đỏ nhạt (nguy hiểm)
>>>>>>> BE_Weather
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

<<<<<<< HEAD
=======
        {/* Phần hiển thị nguy hiểm khi toggle */}
>>>>>>> BE_Weather
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
<<<<<<< HEAD
}
=======
}
>>>>>>> BE_Weather
