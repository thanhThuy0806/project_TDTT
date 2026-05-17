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

// ==========================================
// THÊM IMPORTS CHO TÍNH NĂNG VOICE ASSISTANT
// ==========================================
import { useRouter } from 'expo-router';
import { useAudioPlayer } from 'expo-audio';
import { useVoiceStore } from "../../store/useVoiceStore"; // Đảm bảo đường dẫn này đúng với thư mục store của bạn

export default function HomeScreen() {
  const [userName, setUserName] = useState("Bạn");

  const [isDangerZone, setIsDangerZone] = useState(false);
  const [dangerInfo, setDangerInfo] = useState([
    "Nguy cơ sạt lở đất do mưa lớn",
    "Khu vực vắng người qua lại về đêm",
    "Sóng điện thoại yếu",
  ]);

  // ==========================================
  // LOGIC LẮNG NGHE & XỬ LÝ VOICE TỪ ZUSTAND
  // ==========================================
  const router = useRouter();
  const { navigationRoute, agentAudioUrl, resetVoiceState } = useVoiceStore();

  // Khởi tạo trình phát âm thanh (expo-audio) dựa trên URL từ Backend trả về
  const player = useAudioPlayer(agentAudioUrl);

  // 1. Tác vụ Chuyển Trang (Routing)
  useEffect(() => {
    if (navigationRoute) {
      console.log("LLM Yêu cầu chuyển trang đến:", navigationRoute);
      router.push(navigationRoute); // Thực hiện chuyển trang
      resetVoiceState(); // Dọn dẹp trạng thái sau khi chuyển
    }
  }, [navigationRoute]);

  // 2. Tác vụ Phát Âm Thanh (Text-to-Speech)
  useEffect(() => {
    if (agentAudioUrl && player) {
      console.log("Đang phát âm thanh từ Backend:", agentAudioUrl);
      player.play(); // Kích hoạt loa
    }
  }, [agentAudioUrl, player]);

  // 3. Tác vụ Bảo vệ Giao Diện (Nhả nút Mic khi nghe xong hoặc lỗi mạng)
  useEffect(() => {
    if (player?.status?.didJustFinish) {
      console.log("Đã phát xong âm thanh phản hồi.");
      resetVoiceState(); // Tắt chế độ "Đang trả lời...", nút về màu tím
    }
    
    if (player?.status?.error) {
      console.error("Lỗi tải/phát âm thanh:", player.status.error);
      resetVoiceState(); // Chống đơ màn hình nếu URL hỏng hoặc mất mạng
    }
  }, [player?.status?.didJustFinish, player?.status?.error]);
  // ==========================================


  // LOGIC LẤY THÔNG TIN FIREBASE (GIỮ NGUYÊN)
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
    // Lưu ý nhỏ: Trong mã bạn gửi chưa khai báo biến state setActiveFeatures,
    // Nên nếu bạn gọi hàm này có thể bị lỗi "setActiveFeatures is not defined".
    // Bạn nhớ bổ sung state này nếu có dùng đến nhé!
    // setActiveFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
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