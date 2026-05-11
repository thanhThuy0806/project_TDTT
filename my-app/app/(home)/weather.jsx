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

export default function WeatherIndex() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(0);
  const [loading, setLoading] = useState(true);

  const getAQIText = (aqiData) => {
    const index = aqiData?.["us-epa-index"] || 0;
    const aqiLevels = {
      0: {
        text: "Đang cập nhật",
        color: "#9E9E9E",
      },
      1: {
        text: "Tốt",
        color: "#4CAF50",
      },
      2: {
        text: "Trung bình",
        color: "#FFC107",
      },
      3: {
        text: "Kém",
        color: "#FF9800",
      },
      4: {
        text: "Rất kém",
        color: "#F44336",
      },
      5: {
        text: "Nguy hại",
        color: "#9C27B0",
      },
    };
    return (
      aqiLevels[index] || {
        text: "Không rõ",
        color: "#999",
      }
    );
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

      setCurrentTemp(data?.current?.temp_c || 0);
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

  const aqiInfo = getAQIText(weatherData?.current?.air_quality);
  const weatherAdvice = weatherData?.advice || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
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
        <Thermometer temperature={Math.round(currentTemp)} />

        <View style={styles.infoWrap}>
          <UnifiedCard
            leftIcon={<Droplets color="#00ACC1" size={20} />}
            title="Độ ẩm"
            rightValue={`${weatherData?.current?.humidity}%`}
            titleColor="#00ACC1"
          />

          <UnifiedCard
            leftIcon={<Wind color="#43A047" size={20} />}
            title="Gió"
            rightValue={`${weatherData?.current?.wind_kph} km/h`}
            titleColor="#43A047"
          />
          <UnifiedCard
            leftIcon={<Gauge color="#FB8C00" size={20} />}
            title="Áp suất"
            rightValue={`${weatherData?.current?.pressure_mb} hPa`}
            titleColor="#FB8C00"
          />

          <UnifiedCard
            leftIcon={<Wind color="#E53935" size={20} />}
            title="Gió giật"
            rightValue={`${weatherData?.current?.gust_kph} km/h`}
            titleColor="#E53935"
          />

          <UnifiedCard
            leftIcon={<Sun color="#F9A825" size={20} />}
            title="UV"
            rightValue={`${weatherData?.current?.uv}`}
            titleColor="#F9A825"
          />

          <UnifiedCard
            leftIcon={<Fan color="#5C6BC0" size={20} />}
            title="Chất lượng không khí"
            rightValue={aqiInfo.text}
            titleColor="#5C6BC0"
            valueColor={aqiInfo.color}
          />
        </View>

        <View style={styles.adviceBox}>
          {weatherAdvice.map((item, index) => (
            <Text key={index} style={styles.adviceText}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={styles.forecastSection}>
          <Text style={styles.forecastTitle}>📅 3 ngày tới</Text>

          {weatherData?.forecast?.forecastday?.map((day, idx) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString("vi-VN", {
              weekday: "long",
            });
            return (
              <View key={idx} style={styles.dayCard}>
                <View>
                  <Text style={styles.dayName}>{dayName}</Text>
                  <Text style={styles.dayDesc}>{day.day.condition.text}</Text>
                </View>

                <View style={styles.dayRight}>
                  <Text style={styles.tempHigh}>{day.day.maxtemp_c}°</Text>
                  <Text style={styles.tempLow}>{day.day.mintemp_c}°</Text>
                  <Text style={styles.rainText}>
                    🌧 {day.day.daily_chance_of_rain}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const UnifiedCard = ({
  leftIcon,
  title,
  rightValue,
  titleColor,
  valueColor,
  onPress,
}) => (
  <Pressable style={styles.unifiedCard} onPress={onPress}>
    <View style={styles.cardLeft}>
      <View style={styles.cardIconBg}>{leftIcon}</View>
      <Text style={[styles.cardTitle, { color: titleColor || "#555" }]}>
        {title}
      </Text>
    </View>
    <Text style={[styles.cardValue, { color: valueColor || "#333" }]}>
      {rightValue}
    </Text>
  </Pressable>
);