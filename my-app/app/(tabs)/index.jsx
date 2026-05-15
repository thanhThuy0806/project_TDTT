import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
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
            onToggle={() => toggleFeature("sos")}
            isEnabled={true}
            bgColor="#818CFF"
            navigateTo="/sos"
          />

          <FeatureCard
            title="Thời tiết"
            subtitle="Đang cập nhật"
            icon="cloudy-night"
            onToggle={() => toggleFeature("weather")}
            isEnabled={true}
            bgColor="#f1c27a"
            navigateTo="/weather"
          />

          <FeatureCard
            title="Dò tìm nguy hiểm"
            subtitle="đang được cập nhật"
            icon="location"
            onToggle={() => toggleFeature("map")}
            isEnabled={true}
            bgColor="#80DEEA"
            navigateTo={'/safety-detail'}
          />

          <FeatureCard
            title="Sổ tay an toàn"
            subtitle="7 quy tắc cơ bản"
            icon="book"
            bgColor="#C5E1A5"
            onToggle={() => toggleFeature("tips")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
