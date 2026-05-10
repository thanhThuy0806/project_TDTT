import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FeatureCard from "../../components/FeatureCard";
import { styles } from "../../assets/styles/home/home.styles";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import DangerBanner from "../../components/DangerBanner";

export default function HomeScreen() {
  const [userName, setUserName] = useState("Bạn");

  const [isDangerZone, setIsDangerZone] = useState(false);
  const [dangerInfo, setDangerInfo] = useState([
    "Nguy cơ sạt lở đất do mưa lớn",
    "Khu vực vắng người qua lại về đêm",
    "Sóng điện thoại yếu",
  ]);

  // Quản lý trạng thái các tính năng (để demo nút gạt)
  const [activeFeatures, setActiveFeatures] = useState({
    sos: true,
    weather: false,
    map: false,
    tips: false,
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const unsubscribe = onSnapshot(
      doc(db, "user-info", user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setUserName(docSnap.data().name || "Người dùng");
        } else {
          setUserName(user.displayName || "");
        }
      },
      (error) => {
        console.error("Lỗi onSnapshot:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleFeature = (key) => {
    setActiveFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header: Menu & Avatar */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="grid" size={24} color="#333" />
          </TouchableOpacity>
          <Image
            source={require("../../assets/images/avatar.jpg")}
            style={styles.avatar}
          />
        </View>

        {/* Lời chào */}
        <View style={styles.greeting}>
          <Text style={styles.hiText}>Xin chào, {userName} 👋</Text>
          <Text style={styles.welcomeText}>
            Chào mừng bạn đến với chuyến đi an toàn.
          </Text>
        </View>

        <DangerBanner isDanger={isDangerZone} dangerDetails={dangerInfo} />

        {/* Nút giả lập để bạn TEST (Xóa khi xong) */}
        <TouchableOpacity
          onPress={() => setIsDangerZone(!isDangerZone)}
          style={{ alignSelf: "center", marginBottom: 10 }}
        >
          <Text style={{ color: "#666" }}>
            🚩 [Test] Chuyển đổi vùng nguy hiểm
          </Text>
        </TouchableOpacity>

        {/* Tiêu đề danh mục */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Công cụ hỗ trợ</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>Thêm</Text>
            <Ionicons name="add-circle" size={16} color="#059669" />
          </TouchableOpacity>
        </View>

        {/* Lưới các thẻ (Grid) */}
        <View style={styles.grid}>
          <FeatureCard
            title="Cảnh báo SOS"
            subtitle="Đang sẵn sàng"
            icon="shield-checkmark"
            bgColor={activeFeatures.sos ? "#818CFF" : "#F0F0F0"}
            isEnabled={activeFeatures.sos}
            onToggle={() => toggleFeature("sos")}
            navigateTo="/sos"
          />

          <FeatureCard
            title="Thời tiết"
            subtitle="Cập nhật 5 phút trước"
            icon="cloudy-night"
            bgColor={activeFeatures.weather ? "#FFCC80" : "#FFF3E0"}
            isEnabled={activeFeatures.weather}
            onToggle={() => toggleFeature("weather")}
            navigateTo="/weather"
          />

          <FeatureCard
            title="Bản đồ ngoại tuyến"
            subtitle="Đã tải 2 vùng"
            icon="map"
            bgColor={activeFeatures.map ? "#80DEEA" : "#E0F7FA"}
            isEnabled={activeFeatures.map}
            onToggle={() => toggleFeature("map")}
          />

          <FeatureCard
            title="Sổ tay an toàn"
            subtitle="7 quy tắc cơ bản"
            icon="book"
            bgColor={activeFeatures.tips ? "#C5E1A5" : "#F1F8E9"}
            isEnabled={activeFeatures.tips}
            onToggle={() => toggleFeature("tips")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
