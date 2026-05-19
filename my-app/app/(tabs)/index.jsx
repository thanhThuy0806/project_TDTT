import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FeatureCard from "../../components/FeatureCard";
import { styles as homeStyles } from "../../assets/styles/home/home.styles";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import DangerBanner from "../../components/DangerBanner";
import SafeMap from "../../components/SafeMap";
import { useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useVoiceStore } from "../../store/useVoiceStore";
 
export default function HomeScreen() {
  const [userName, setUserName] = useState("Bạn");
  const [isDangerZone, setIsDangerZone] = useState(false);
  const [dangerInfo, setDangerInfo] = useState([
    "Nguy cơ sạt lở đất do mưa lớn",
    "Khu vực vắng người qua lại về đêm",
    "Sóng điện thoại yếu",
  ]);
 
  const router = useRouter();

  const { 
    navigationRoute, agentAudioUrl, agentContent, 
    lat, lng, footnote, 
    isPopupVisible, closePopup, isVoiceEnabled, setIsVoiceEnabled 
  } = useVoiceStore();
 
  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);
 
  useEffect(() => {
    if (navigationRoute) {
      router.push(navigationRoute);
      useVoiceStore.getState().resetVoiceState();
    }
  }, [navigationRoute]);
 
  useEffect(() => {
    if (isPopupVisible && agentAudioUrl && player) {
      player.replace({ uri: agentAudioUrl });
      if (isVoiceEnabled) player.play();
    }
  }, [agentAudioUrl, isPopupVisible]);
 
  const handleClosePopup = () => {
    if (player) player.pause();
    closePopup();
  };

  const handleToggleAudio = (value) => {
    setIsVoiceEnabled(value);
    if (value) player?.play();
    else player?.pause();
  };

  const formatTime = (ms) => {
    if (!ms) return "0s";
    return `${Math.floor(ms / 1000)}s`;
  };
 
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "user-info", user.uid), (docSnap) => {
      setUserName(docSnap.exists() ? (docSnap.data().name || "Người dùng") : (user.displayName || ""));
    });
    return () => unsubscribe();
  }, []);
 
  return (
    <SafeAreaView style={homeStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={homeStyles.scrollContent}>
        <View style={homeStyles.header}>
          <Image source={require("../../assets/images/avatar.jpg")} style={homeStyles.avatar} />
          <View style={homeStyles.greeting}>
            <Text style={homeStyles.hiText}>Xin chào, {userName} 👋</Text>
            <Text style={homeStyles.welcomeText}>Chuyến đi của bạn luôn an toàn.</Text>
          </View>
        </View>
 
        <DangerBanner isDanger={isDangerZone} dangerDetails={dangerInfo} />
 
        <View style={homeStyles.sectionTitleRow}>
          <Text style={homeStyles.sectionTitle}>Công cụ hỗ trợ</Text>
          <TouchableOpacity style={homeStyles.addBtn}>
            <Text style={homeStyles.addBtnText}>Thêm</Text>
            <Ionicons name="add-circle" size={16} color="#059669" />
          </TouchableOpacity>
        </View>
 
        <View style={homeStyles.grid}>
          <FeatureCard title="Cảnh báo SOS" icon="alert-circle" bgColor={"#EF4444"} navigateTo="/sos" />
          <FeatureCard title="Thời tiết" icon="cloudy-night" bgColor={"#3B82F6"} navigateTo="/weather" />
          <FeatureCard title="Bản đồ" icon="map" bgColor={"#10B981"} navigateTo="/safety-detail" />
          <FeatureCard title="Sổ tay" icon="book" bgColor={"#F59E0B"} />
        </View>
      </ScrollView>

      {/* ========================================= */}
      {/* POP-UP MODAL HIỂN THỊ PHẢN HỒI TỪ AGENT   */}
      {/* ========================================= */}
      <Modal
        visible={isPopupVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            
            {/* 1/3 Trên: Bản đồ & Nút Tắt */}
            <View style={modalStyles.mapSection}>
               {/* [MỚI]: Sử dụng lat, lng từ Store truyền vào Bản đồ */}
               <SafeMap 
                  latitude={lat || 10.762622} 
                  longitude={lng || 106.660172} 
               />
               <TouchableOpacity style={modalStyles.closeBtn} onPress={handleClosePopup}>
                 <Ionicons name="close" size={24} color="#333" />
               </TouchableOpacity>
            </View>

            {/* 2/3 Dưới: Nội dung & Điều khiển Âm thanh */}
            <View style={modalStyles.contentSection}>
               <ScrollView showsVerticalScrollIndicator={false} style={modalStyles.textArea}>
                 {/* [MỚI]: Ưu tiên hiển thị footnote, nếu LLM lỗi không sinh ra footnote thì dùng tạm agentContent */}
                 <Text style={modalStyles.agentText}>{footnote || agentContent}</Text>
               </ScrollView>

               {/* Góc phải dưới: Trạng thái thời gian & Switch loa */}
               <View style={modalStyles.audioControlRow}>
                  <Text style={modalStyles.timeText}>
                    Giọng Nói
                  </Text>
                  <Switch
                    value={isVoiceEnabled}
                    onValueChange={handleToggleAudio}
                    trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
                    thumbColor={isVoiceEnabled ? "#3B82F6" : "#F8FAFC"}
                  />
               </View>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    height: "70%", 
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden", 
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  mapSection: {
    flex: 1, 
    backgroundColor: "#E2E8F0",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  contentSection: {
    flex: 2, 
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    flex: 1,
    marginBottom: 10,
  },
  agentText: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 26,
    fontWeight: "500",
  },
  audioControlRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: "#64748B",
    marginRight: 12,
    fontWeight: "bold",
  },
});