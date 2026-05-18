import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FeatureCard from "../../components/FeatureCard";
import { styles } from "../../assets/styles/home/home.styles";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import DangerBanner from "../../components/DangerBanner";
import { useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useVoiceStore } from "../../store/useVoiceStore"
 
export default function HomeScreen() {
  const [userName, setUserName] = useState("Bạn");
 
  const [isDangerZone, setIsDangerZone] = useState(false);
  const [dangerInfo, setDangerInfo] = useState([
    "Nguy cơ sạt lở đất do mưa lớn",
    "Khu vực vắng người qua lại về đêm",
    "Sóng điện thoại yếu",
  ]);
 
  const router = useRouter();
  const { navigationRoute, agentAudioUrl, resetVoiceState } = useVoiceStore();
 
  // Khởi tạo player một lần duy nhất, không truyền URL vào constructor
  const player = useAudioPlayer(null);
 
  // useAudioPlayerStatus trả về status object được cập nhật realtime,
  // bao gồm trường `didJustFinish` - đáng tin cậy hơn watch playbackState trực tiếp
  const playerStatus = useAudioPlayerStatus(player);
 
  // Tác vụ Chuyển Trang (Routing)
  useEffect(() => {
    if (navigationRoute) {
      console.log("LLM Yêu cầu chuyển trang đến:", navigationRoute);
      router.push(navigationRoute);
      resetVoiceState();
    }
  }, [navigationRoute]);
 
  // Tác vụ Phát Âm Thanh (Text-to-Speech)
  // Mỗi khi agentAudioUrl thay đổi sang một URL mới, load lại source rồi play
  useEffect(() => {
    if (!agentAudioUrl || !player) return;
 
    console.log("Đang phát âm thanh từ Backend:", agentAudioUrl);
    player.replace({ uri: agentAudioUrl });
    player.play();
  }, [agentAudioUrl]);
 
  // Lắng nghe trạng thái phát qua useAudioPlayerStatus
  // didJustFinish: true khi audio vừa kết thúc tự nhiên
  // Dùng ref để tránh gọi resetVoiceState nhiều lần liên tiếp
  const hasResetRef = useRef(false);
 
  useEffect(() => {
    if (!agentAudioUrl) {
      hasResetRef.current = false;
      return;
    }
 
    if (hasResetRef.current) return;
 
    if (playerStatus?.didJustFinish) {
      console.log("Âm thanh kết thúc. Đang đưa nút về vị trí ban đầu...");
      hasResetRef.current = true;
      resetVoiceState();
    }
 
    if (playerStatus?.error) {
      console.log("Lỗi phát âm thanh:", playerStatus.error);
      hasResetRef.current = true;
      resetVoiceState();
    }
  }, [playerStatus?.didJustFinish, playerStatus?.error, agentAudioUrl]);
 
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
 
        {/* Tiêu đề danh mục */}
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
          <FeatureCard 
            title="Bản đồ"
            icon="map" 
            bgColor={"#10B981"}
            navigateTo="/safety-detail"
          />
          <FeatureCard title="Sổ tay" icon="book" bgColor={"#F59E0B"} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}