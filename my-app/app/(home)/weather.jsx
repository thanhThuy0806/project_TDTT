import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  MoreHorizontal,
  Wind,
  Droplets,
  Sun,
  Fan,
  Minus,
  Plus,
} from "lucide-react-native";
import Thermometer from "../../components/Thermometer";
import { styles} from "../../assets/styles/(home)/weather.styles";


// --- Main Weather Index Screen ---
export default function WeatherIndex() {
  // 1. State nhiệt độ (Để test thay đổi trực quan, mình thêm nút tăng giảm ở cuối)
  const [currentTemp, setCurrentTemp] = useState(19);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header (Giữ nguyên) */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft color="#000" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Weather Detail</Text>
        <Pressable style={styles.iconBtn}>
          <MoreHorizontal color="#000" size={24} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Giao diện nhiệt kế mới với giá trị top */}
        <Thermometer temperature={currentTemp} />
        {/* Các thẻ thông số Grid 3 cột */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: "#E0F7FA" }]}>
            <Droplets color="#00ACC1" size={28} />
            <Text style={styles.statLabel}>Humidity</Text>
            <Text style={styles.statValue}>45%</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#F1F8E9" }]}>
            <Wind color="#7be40a" size={28} />
            <Text style={styles.statLabel}>Wind</Text>
            <Text style={styles.statValue}>12km/h</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#FFF3E0" }]}>
            <Sun color="#FB8C00" size={28} />
            <Text style={styles.statLabel}>UV Index</Text>
            <Text style={styles.statValue}>Low</Text>
          </View>
        </View>

        {/* Thanh dưới cùng*/}
        <View style={styles.bottomBar}>
          <View style={styles.fanSection}>
            <View style={styles.fanIconBg}>
              <Fan color="#5C6BC0" size={20} />
            </View>
            <Text style={styles.fanText}>Air Quality</Text>
          </View>
          <Text style={styles.qualityValue}>Good (60%)</Text>
        </View>

        {/* Nút test tăng giảm nhiệt độ (Dev only - Giữ lại) */}
        <View style={styles.testControl}>
          <Pressable
            onPress={() => setCurrentTemp((t) => t - 2)}
            style={styles.testBtn}
          >
            <Minus color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => setCurrentTemp((t) => t + 2)}
            style={styles.testBtn}
          >
            <Plus color="#fff" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}