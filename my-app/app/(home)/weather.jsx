import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
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
import { styles } from "../../assets/styles/home/weather.styles";
// import { getWeatherData } from "../../services/weatherService";

const MOCK_WEATHER_DATA = {
  location: { name: "Ho Chi Minh City" },
  current: {
    temp_c: 32,
    humidity: 65,
    wind_kph: 15.5,
    uv: 8,
    air_quality: {
      "us-epa-index": 1,
    },
  },
};

export default function WeatherIndex() {
  const [weatherData, setWeatherData] = useState(MOCK_WEATHER_DATA);
  const [loading, setLoading] = useState(false);
  // const [weatherData, setWeatherData] = useState(null);
  // const [loading, setLoading] = useState(true);

  // const loadData = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await getWeatherData("Ho Chi Minh");
  //     setWeatherData(data);
  //   } catch (error) {
  //     Alert.alert("Lỗi", "Không thể kết nối tới máy chủ Backend");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   loadData();
  // }, []);

  // const getAQIText = (aqiData) => {
  //   const index = aqiData?.["us-epa-index"] || 0;
  //   const levels = [
  //     "Đang cập nhật",
  //     "Tốt",
  //     "Trung bình",
  //     "Kém",
  //     "Rất kém",
  //     "Nguy hại",
  //   ];
  //   return levels[index] || "Không rõ";
  // };

  // if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft color="#000" size={24} />
        </Pressable>

        <Text style={styles.headerTitle}>
          {weatherData?.location?.name || "Thời Tiết"}
        </Text>

        <Pressable style={styles.iconBtn} onPress={loadData}>
          <MoreHorizontal color="#000" size={24} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Giao diện nhiệt kế mới với giá trị top */}
        <Thermometer
          temperature={Math.round(weatherData?.current?.temp_c || 0)}
        />

        <View style={styles.statsGrid}>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Droplets color="#00ACC1" size={28} />}
              label="Độ ẩm"
              value={`${weatherData?.current?.humidity}%`}
              bgColor="#E0F7FA"
            />
            <StatCard
              icon={<Wind color="#7be40a" size={28} />}
              label="Gió"
              value={`${weatherData?.current?.wind_kph} km/h`}
              bgColor="#F1F8E9"
            />
            <StatCard
              icon={<Sun color="#FB8C00" size={28} />}
              label="Chỉ số UV"
              value={weatherData?.current?.uv}
              bgColor="#FFF3E0"
            />
          </View>
        </View>

        {/* Thanh dưới cùng*/}
        <View style={styles.bottomBar}>
          <View style={styles.fanSection}>
            <View style={styles.fanIconBg}>
              <Fan color="#5C6BC0" size={20} />
            </View>
            <Text style={styles.fanText}>Không khí</Text>
          </View>
          <Text style={styles.qualityValue}>
            {getAQIText(weatherData?.current?.air_quality)}
          </Text>
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

const StatCard = ({ icon, label, value, bgColor }) => (
  <View style={[styles.statCard, { backgroundColor: bgColor }]}>
    {icon}
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);
