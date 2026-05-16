import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Rss, Check, X } from "lucide-react-native";
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
import { Modal, ScrollView } from "react-native";
import {
  getCurrentLocation,
  searchRescueUnit,
  buildSOSMessage,
  sendEmergencySMS,
} from "@/services/sosService";

const EMERGENCY_TYPES = [
  { id: "medical", label: "Y tế", icon: "medkit", color: "#D4E157" },
  { id: "fire", label: "Hỏa hoạn", icon: "flame", color: "#FFAB91" },
  { id: "disaster", label: "Thiên tai", icon: "business", color: "#A7FFEB" },
  { id: "accident", label: "Tai nạn", icon: "car", color: "#D1C4E9" },
  { id: "violence", label: "Bạo động", icon: "shield", color: "#F48FB1" },
  { id: "rescue", label: "Cứu hộ", icon: "water", color: "#FFF59D" },
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function SOSScreen() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [countdown, setCountdown] = useState(5);
  const [selectedType, setSelectedType] = useState(null);
  const [emergencyPhone, setEmergencyPhone] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sosResult, setSosResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const timerRef = useRef(null);
  const progress = useSharedValue(0);
  const CIRCLE_LENGTH = 300;
  const R = CIRCLE_LENGTH / (2 * Math.PI);
  const shakeOffset = useSharedValue(0);

  useEffect(() => {
    fetchEmergencyContact();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fetchEmergencyContact = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const userDocRef = doc(db, "user-info", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setEmergencyPhone(userData.emergencyPhone || null);
      }
    } catch (error) {
      console.log("Lỗi lấy thông tin người thân:", error);
    }
  };

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

  const handleEmergencyAction = async () => {
    try {
      if (isSending) return;
      setIsSending(true);

      if (!emergencyPhone) {
        Alert.alert(
          "Lỗi",
          "Bạn chưa thiết lập số điện thoại người thân trong phần cài đặt!"
        );
        setStatus("idle");
        return;
      }

      const coords = await getCurrentLocation();
      if (!coords) {
        Alert.alert("Lỗi", "Không thể lấy vị trí hiện tại của bạn!");
        setStatus("idle");
        return;
      }

      const lat = coords.latitude;
      const lng = coords.longitude;

      const data = await searchRescueUnit({
        lat,
        lng,
        emergencyType: selectedType,
      });

      if (__DEV__) console.log("SOS RESPONSE: ", data);

      const message = buildSOSMessage({
        data,
        lat,
        lng,
        emergencyType: selectedType,
        emergencyTypes: EMERGENCY_TYPES,
      });

      await sendEmergencySMS({ phone: emergencyPhone, message });

      setStatus("send");
      setSosResult({
        emergencyType:
          EMERGENCY_TYPES.find((t) => t.id === selectedType)?.label ||
          "Khẩn cấp",
        unitName: data?.unit?.name || "Đang chờ cứu hộ...",
        unitAddress: data?.unit?.address || "",
        emergencyPhone,
        location: `${lat}, ${lng}`,
        time: new Date().toLocaleString(),
      });
      setShowResult(true);
    } catch (error) {
      console.log("SOS ERROR:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi tín hiệu cứu trợ!");
      setStatus("idle");
    } finally {
      setIsSending(false);
    }
  };

  const startSOS = () => {
    if (status !== "idle") return;

    if (!selectedType) {
      triggerShake();
      return;
    }

    setStatus("counting");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    progress.value = withTiming(1, { duration: 3000, easing: Easing.linear });

    let currentCount = 5;
    setCountdown(currentCount);
    timerRef.current = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);
      if (currentCount <= 0) {
        clearInterval(timerRef.current);
        handleEmergencyAction();
      }
    }, 1000);
  };

  const cancelSOS = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle");
    setCountdown(5);
    progress.value = 0;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleDone = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle");
    setCountdown(5);
    progress.value = 0;
    setSelectedType(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft color="#000" size={28} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Hỗ Trợ Khẩn Cấp</Text>
        <Text style={styles.subtitle}>Nhấn để gửi tín hiệu cứu trợ</Text>

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

        {status === "counting" && (
          <Pressable
            onPress={cancelSOS}
            style={{ marginTop: 20, alignItems: "center" }}
          >
            <X color="#E91E63" size={28} />
            <Text style={{ color: "#E91E63", marginTop: 4, fontWeight: "600" }}>
              Hủy SOS
            </Text>
          </Pressable>
        )}

        <Animated.View style={[styles.emergencySection, animatedShakeStyle]}>
          <Text
            style={[
              styles.sectionTitle,
              !selectedType && status === "idle" && { color: "#E91E63" },
            ]}
          >
            Tình trạng hiện tại của bạn?{" "}
            {!selectedType && status === "idle" && "*"}
          </Text>

          <View style={styles.chipContainer}>
            {EMERGENCY_TYPES.map((item) => {
              const isSelected = selectedType === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    status === "idle" &&
                    (setSelectedType(item.id), Haptics.selectionAsync())
                  }
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
        </Animated.View>

        {/* {status === "sent" && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Tín hiệu đã được gửi thành công!
            </Text>
            <Pressable style={styles.doneBtn} onPress={handleDone}>
              <LinearGradient
                colors={["#FF8A65", "#E91E63"]}
                style={styles.doneGradient}
              >
                <Text style={styles.doneText}>Xong</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )} */}

        {status === "send" && sosResult && (
          <Modal visible={showResult} transparent animationType="fade">
            <View style={styles.successOverlay}>
              <View style={styles.successContainer}>
                <Text style={styles.successTitle}>
                  SOS đã được gửi thành công!
                </Text>

                <ScrollView>
                  <Text style={styles.item}>
                    <Text style={styles.label}>Trình trạng:</Text> {""}
                    {sosResult?.emergencyType}
                  </Text>

                  <Text style={styles.item}>
                    <Text style={styles.label}>Đơn vị hỗ trợ: </Text> {""}
                    {sosResult?.unitName} - {sosResult?.unitAddress}
                  </Text>

                  <Text style={styles.item}>
                    <Text style={styles.label}>Người thân: </Text> {""}
                    {sosResult?.emergencyPhone}
                  </Text>

                  <Text style={styles.item}>
                    <Text style={styles.label}>Vị trí: </Text> {""}
                    {sosResult?.location}
                  </Text>

                  <Text style={styles.item}>
                    <Text style={styles.label}>Thời gian: </Text> {""}
                    {sosResult?.time}
                  </Text>
                </ScrollView>

                <Pressable
                  onPress={() => {
                    setShowResult(false);
                    handleDone();
                  }}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeText}>Đóng</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}
