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
  Gauge,
} from "lucide-react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import Thermometer from "../../components/Thermometer";
import { styles } from "../../assets/styles/home/weather.styles";
import { getWeatherData } from "../../services/weatherService";
import { LinearGradient } from "expo-linear-gradient";

export default function WeatherIndex() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState(null);
  // const [currentTemp, setCurrentTemp] = useState(0);
  const [loading, setLoading] = useState(true);

  const getAQIText = (aqiData) => {
    const index = aqiData?.["us-epa-index"] || 0;
    const aqiLevels = {
      0: { text: "Đang cập nhật", color: "#9E9E9E" },
      1: { text: "Tốt", color: "#4CAF50" },
      2: { text: "Trung bình", color: "#FFC107" },
      3: { text: "Kém", color: "#FF9800" },
      4: { text: "Rất kém", color: "#F44336" },
      5: { text: "Nguy hại", color: "#9C27B0" },
    };
    return aqiLevels[index] || { text: "Không rõ", color: "#999" };
  };

  const getGradientColors = (temp) => {
    if (temp >= 35) return ["#FF5F6D", "#FFC371"];
    if (temp >= 30) return ["#F2994A", "#F2C94C"];
    if (temp >= 25) return ["#56CCF2", "#2F80ED"];
    if (temp >= 18) return ["#89f7fe", "#66a6ff"];
    return ["#ece9e6", "#ffffff"];
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Lỗi", "Bạn chưa cấp quyền vị trí");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;

      const data = await getWeatherData(lat, lon);

      setWeatherData(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu thời tiết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !weatherData)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const { current, forecast, advice, location } = weatherData;
  const todayForecast = forecast?.forecastday?.[0]?.day || {};
  const aqiInfo = getAQIText(current?.air_quality);
  const currentTemp = current?.temp_c || 0;
  const colors = getGradientColors(currentTemp);

  return (
    <LinearGradient colors={colors} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable style={styles.iconBtn} onPress={() => router.back()}>
            <ChevronLeft color="#000" size={24} />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.locationText}>
              {location?.name || "Vị trí không xác định"}
            </Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" • "}
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.mainWeather}>
            <Text style={styles.mainTemp}>{Math.round(current?.temp_c)}°C</Text>
            <View style={styles.minMaxContainer}>
              <Text style={styles.minMaxText}>
                ↑ Cao nhất: {Math.round(todayForecast?.maxtemp_c)}°
              </Text>
              <Text style={[styles.minMaxText, { marginLeft: 15 }]}>
                ↓ Thấp nhất: {Math.round(todayForecast?.mintemp_c)}°
              </Text>
            </View>
          </View>

          <View style={styles.notificationCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>Khuyến nghị</Text>
            </View>
            {advice?.map((item, index) => (
              <View key={index} style={styles.adviceItem}>
                <View style={styles.orangeDot} />
                <Text style={styles.adviceText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.detailsGrid}>
            <Text style={styles.sectionTitle}>Chi tiết</Text>
            <View style={styles.gridRow}>
              <DetailItem
                icon={<Fan color="#5C6BC0" size={20} />}
                label="Chất lượng không khí"
                value={aqiInfo.text}
              />
            </View>

            <View style={styles.gridRow}>
              <DetailItem
                icon={<Droplets color="#00ACC1" size={20} />}
                label="Độ ẩm"
                value={`${current?.humidity}%`}
              />
              <DetailItem
                icon={<Wind color="#43A047" size={20} />}
                label="Gió"
                value={`${current?.wind_kph} km/h`}
              />
            </View>

            <View style={styles.gridRow}>
              <DetailItem
                icon={<Gauge color="#FB8C00" size={20} />}
                label="Áp suất"
                value={`${current?.pressure_mb} hPa`}
              />
              <DetailItem
                icon={<Sun color="#F9A825" size={20} />}
                label="UV"
                value={`${current?.uv}`}
              />
            </View>
          </View>

          <View style={styles.forecastSection}>
            <Text style={styles.sectionTitle}>📅 3 ngày tới</Text>
            {forecast?.forecastday.map((day, idx) => (
              <View key={idx} style={styles.forecastRow}>
                <Text style={styles.forecastDayName}>
                  {new Date(day.date).toLocaleDateString("vi-VN", {
                    weekday: "short",
                  })}
                </Text>
                <Text style={styles.forecastCondition}>
                  {day.day.condition.text}
                </Text>
                <View style={styles.forecastTempRange}>
                  <Text style={styles.forecastTempHigh}>
                    {Math.round(day.day.maxtemp_c)}°
                  </Text>
                  <Text style={styles.forecastTempLow}>
                    {Math.round(day.day.mintemp_c)}°
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailBox}>
    <View style={styles.detailIcon}>{icon}</View>
    <View>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
  </View>
);