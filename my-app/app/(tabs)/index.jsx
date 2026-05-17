import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
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
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/avatar.jpg")}
            style={styles.avatar}
          />
          <View style={styles.greeting}>
            <Text style={styles.hiText}>Xin chào, {userName} 👋</Text>
            <Text style={styles.welcomeText}>
              Chuyến đi của bạn luôn an toàn.
            </Text>
          </View>
        </View>

        <DangerBanner isDanger={isDangerZone} dangerDetails={dangerInfo} />

        <TouchableOpacity
          onPress={() => setIsDangerZone(!isDangerZone)}
          style={{ alignSelf: "center", marginBottom: 10 }}
        >
          <Text style={{ color: "#666" }}>
            🚩 [Test] Chuyển đổi vùng nguy hiểm
          </Text>
        </TouchableOpacity>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Công cụ hỗ trợ</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>Thêm</Text>
            <Ionicons name="add-circle" size={16} color="#059669" />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <FeatureCard
            title="Cảnh báo SOS"
            icon="alert-circle"
            bgColor={"#EF4444"}
            navigateTo="/sos"
          />
          <FeatureCard
            title="Thời tiết"
            icon="cloudy-night"
            bgColor={"#3B82F6"}
            navigateTo="/weather"
          />
          <FeatureCard title="Bản đồ" icon="map" bgColor={"#10B981"} />
          <FeatureCard title="Sổ tay" icon="book" bgColor={"#F59E0B"} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
