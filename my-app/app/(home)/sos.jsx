import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, Linking, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Rss, Check } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
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
import { API_URL } from "@/constants/api";

const EMERGENCY_TYPES = [
  { id: "medical", label: "Y tế", icon: "medkit", color: "#D4E157" },
  { id: "fire", label: "Hỏa hoạn", icon: "flame", color: "#FFAB91" },
  { id: "disaster", label: "Thiên tai", icon: "business", color: "#A7FFEB" },
  { id: "accident", label: "Tai nạn", icon: "car", color: "#D1C4E9" },
  { id: "violence", label: "Bạo lực", icon: "shield", color: "#F48FB1" },
  { id: "rescue", label: "Cứu hộ", icon: "water", color: "#FFF59D" },
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function SOSScreen() {
  const [emergencyPhone, setEmergencyPhone] = useState('0123456789'); // Số mặc định nếu chưa kịp load
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [countdown, setCountdown] = useState(3);
  const [selectedType, setSelectedType] = useState(null);

  // ĐỌC THÔNG TIN TỪ USER-INFO
useEffect(() => {
  const fetchEmergencyContact = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDocRef = doc(db, "user-info", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmergencyPhone(userData.emergencyPhone); // Cập nhật số thật từ Firebase vào đây
        }
      } catch (error) {
        console.log("Lỗi lấy thông tin người thân:", error);
      }
    }
  };
  fetchEmergencyContact();
}, []);

// --- LOGIC LẤY VỊ TRÍ THẬT ---
  const getCurrentLocation = async () => {
    try {
      // Xin quyền
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Lỗi", "Bạn cần cho phép truy cập vị trí để gửi cứu hộ!");
        return null;
      }

      // Lấy tọa độ
      let locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return locationData.coords;
    } catch (error) {
      console.log("Lỗi GPS:", error);
      return null;
    }
  };

  // --- PHẦN ANIMATION  ---
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

  // --- HÀM 1: XỬ LÝ GỌI BACKEND VÀ SMS ---
  const handleEmergencyAction = async () => {
    console.log(">>> ĐANG GỌI API BACKEND...");
    // Lấy vị trí thật
    const coords = await getCurrentLocation();
    const lat = coords?.latitude || 10.762622; // Fallback nếu lỗi GPS
    const lng = coords?.longitude || 106.681040;
    try {
      const isAvailable = await SMS.isAvailableAsync();

      const response = await fetch(`${API_URL}/api/sos/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: lat,
          lng: lng,
          emergency_type: selectedType
        })
      });

      const data = await response.json();
      console.log(">>> KẾT QUẢ BACKEND:", data);

      let rescueInfo = "Đang chờ cứu hộ...";
      let unitLocationLink = "";

      // KIỂM TRA DỮ LIỆU TỪ BACKEND
      if (data.status === "success" && data.unit) {
        rescueInfo = `Đơn vị cứu trợ gần nhất: ${data.unit.name} - ${data.unit.address}`;

      }

      const typeLabel = EMERGENCY_TYPES.find(t => t.id === selectedType)?.label;
      const userLocation = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      const searchQuery = encodeURIComponent(`${data.unit.name} ${data.unit.address}`);

      const message = `[SOS - ${typeLabel.toUpperCase()}] Tôi đang gặp sự cố!\n${rescueInfo}${unitLocationLink}\nVị trí của tôi: ${userLocation}\nĐường đi đến đơn vị: https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

      // CHỈ GỬI SMS MỘT LẦN DUY NHẤT
      if (Platform.OS === 'web') {
        const url = `sms:${emergencyPhone}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(message)}`;
        Linking.openURL(url);
      } else if (isAvailable) {
        await SMS.sendSMSAsync([emergencyPhone], message);
      } else {
        Alert.alert("Lỗi", "Thiết bị không hỗ trợ gửi SMS");
      }

    } catch (error) {
      console.log(">>> LỖI KẾT NỐI:", error.message);
      Alert.alert("Lỗi", "Không thể kết nối đến Backend!");
    }
  };

  // --- HÀM 2: KÍCH HOẠT ĐẾM NGƯỢC ---
  const startSOS = () => {
    if (!selectedType) {
      triggerShake();
      return;
    }

    setStatus("counting");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    progress.value = withTiming(1, { duration: 3000, easing: Easing.linear });

    let currentCount = 3;
    let timer = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);

      if (currentCount <= 0) {
        clearInterval(timer);
        setStatus("sent");
        handleEmergencyAction(); // Chạy API sau khi đếm xong
      }
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
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#000" size={28} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Hỗ Trợ Khẩn Cấp{"\n"}needed?</Text>
        <Text style={styles.subtitle}>Nhấn để gửi tín hiệu cứu trợ</Text>

        <View style={styles.buttonContainer}>
          {status === "counting" && (
            <Svg style={styles.svg}>
              <Circle cx="100" cy="100" r={R} stroke="#F0EAE5" strokeWidth="15" fill="transparent" />
              <AnimatedCircle
                cx="100" cy="100" r={R} stroke="#E91E63" strokeWidth="15" fill="transparent"
                strokeDasharray={CIRCLE_LENGTH} animatedProps={animatedProps} strokeLinecap="round"
              />
            </Svg>
          )}

          <Pressable
            onPress={status === "idle" ? startSOS : null}
            style={({ pressed }) => [
              styles.mainButton,
              pressed && status === "idle" && { transform: [{ scale: 0.95 }] },
            ]}
          >
            <LinearGradient colors={["#FF8A65", "#E91E63"]} style={styles.gradient}>
              {status === "idle" && <Rss color="#FFF" size={40} />}
              {status === "counting" && <Text style={styles.countText}>{countdown}</Text>}
              {status === "sent" && <Check color="#FFF" size={45} />}
            </LinearGradient>
          </Pressable>
        </View>

        <Animated.View style={[styles.emergencySection, animatedShakeStyle]}>
          <Text style={[styles.sectionTitle, !selectedType && status === "idle" && { color: "#E91E63" }]}>
            Tình trạng hiện tại của bạn? {!selectedType && status === "idle" && "*"}
          </Text>

          <View style={styles.chipContainer}>
            {EMERGENCY_TYPES.map((item) => {
              const isSelected = selectedType === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => status === "idle" && (setSelectedType(item.id), Haptics.selectionAsync())}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} color="#000" size={18} />
                  </View>
                  <Text style={styles.chipLabel}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {status === "sent" && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Tín hiệu đã được gửi thành công!</Text>
            <Pressable style={styles.doneBtn} onPress={handleDone}>
              <LinearGradient colors={["#FF8A65", "#E91E63"]} style={styles.doneGradient}>
                <Text style={styles.doneText}>Xong</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}