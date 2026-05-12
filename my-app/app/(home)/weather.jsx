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
<<<<<<< HEAD
  Minus,
  Plus,
  Gauge,
  CloudRain,
} from "lucide-react-native";
import { useRouter } from "expo-router";
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
    pressure_mb: 1012,
    gust_kph: 22.3,
    air_quality: {
      "us-epa-index": 1,
    },
  },
  forecast: {
    forecastday: [
      {
        date: "2024-01-15",
        day: {
          maxtemp_c: 34,
          mintemp_c: 24,
          daily_chance_of_rain: 20,
          condition: { text: "Nắng" },
        },
      },
      {
        date: "2024-01-16",
        day: {
          maxtemp_c: 31,
          mintemp_c: 25,
          daily_chance_of_rain: 40,
          condition: { text: "Mây rải rác" },
        },
      },
      {
        date: "2024-01-17",
        day: {
          maxtemp_c: 33,
          mintemp_c: 23,
          daily_chance_of_rain: 10,
          condition: { text: "Nắng" },
        },
      },
    ],
  },
};

export default function WeatherIndex() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState(MOCK_WEATHER_DATA);
  const [currentTemp, setCurrentTemp] = useState(
    MOCK_WEATHER_DATA.current.temp_c
  );

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
=======
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
>>>>>>> BE_Weather

  const getAQIText = (aqiData) => {
    const index = aqiData?.["us-epa-index"] || 0;
    const aqiLevels = {
      0: {
        text: "Đang cập nhật",
        color: "#9E9E9E",
<<<<<<< HEAD
        advice: "Đang cập nhật dữ liệu",
=======
>>>>>>> BE_Weather
      },
      1: {
        text: "Tốt",
        color: "#4CAF50",
<<<<<<< HEAD
        advice: "Thích hợp cho hoạt động ngoài trời",
=======
>>>>>>> BE_Weather
      },
      2: {
        text: "Trung bình",
        color: "#FFC107",
<<<<<<< HEAD
        advice: "Người nhạy cảm nên hạn chế ra ngoài",
=======
>>>>>>> BE_Weather
      },
      3: {
        text: "Kém",
        color: "#FF9800",
<<<<<<< HEAD
        advice: "Nên đeo khẩu trang khi ra ngoài",
=======
>>>>>>> BE_Weather
      },
      4: {
        text: "Rất kém",
        color: "#F44336",
<<<<<<< HEAD
        advice: "Hạn chế tối đa hoạt động ngoài trời",
=======
>>>>>>> BE_Weather
      },
      5: {
        text: "Nguy hại",
        color: "#9C27B0",
<<<<<<< HEAD
        advice: "Ở trong nhà, đóng kín cửa",
      },
    };

=======
      },
    };
>>>>>>> BE_Weather
    return (
      aqiLevels[index] || {
        text: "Không rõ",
        color: "#999",
<<<<<<< HEAD
        advice: "Không có dữ liệu",
=======
>>>>>>> BE_Weather
      }
    );
  };

<<<<<<< HEAD
  const aqiInfo = getAQIText(weatherData?.current?.air_quality);
  const weatherAdvice = getWeatherAdvice(weatherData?.current, aqiInfo);

  // if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const refreshData = () => {
    // Tạo dữ liệu mới random cho mock
    const newTemp = Math.floor(Math.random() * (38 - 25 + 1) + 25); // 25-38 độ
    const newHumidity = Math.floor(Math.random() * (90 - 50 + 1) + 50); // 50-90%
    const newWind = (Math.random() * (30 - 5) + 5).toFixed(1); // 5-30 km/h
    const newUV = Math.floor(Math.random() * (11 - 1 + 1) + 1); // 1-11 UV
    const newAQI = Math.floor(Math.random() * 5) + 1; // 1-5 AQI index
    const newPressure = Math.floor(Math.random() * (1025 - 990 + 1) + 990);
    const newGust = (Math.random() * (35 - 10) + 10).toFixed(1);

    const newForecast = {
      forecastday: [
        {
          date: "2024-01-15",
          day: {
            maxtemp_c: Math.floor(Math.random() * (36 - 28 + 1) + 28),
            mintemp_c: Math.floor(Math.random() * (26 - 22 + 1) + 22),
            daily_chance_of_rain: Math.floor(Math.random() * 100),
            condition: {
              text: ["Nắng", "Mây", "Mưa nhẹ"][Math.floor(Math.random() * 3)],
            },
          },
        },
        {
          date: "2024-01-16",
          day: {
            maxtemp_c: Math.floor(Math.random() * (36 - 28 + 1) + 28),
            mintemp_c: Math.floor(Math.random() * (26 - 22 + 1) + 22),
            daily_chance_of_rain: Math.floor(Math.random() * 100),
            condition: {
              text: ["Nắng", "Mây", "Mưa nhẹ"][Math.floor(Math.random() * 3)],
            },
          },
        },
        {
          date: "2024-01-17",
          day: {
            maxtemp_c: Math.floor(Math.random() * (36 - 28 + 1) + 28),
            mintemp_c: Math.floor(Math.random() * (26 - 22 + 1) + 22),
            daily_chance_of_rain: Math.floor(Math.random() * 100),
            condition: {
              text: ["Nắng", "Mây", "Mưa nhẹ"][Math.floor(Math.random() * 3)],
            },
          },
        },
      ],
    };

    const newWeatherData = {
      location: { name: "Ho Chi Minh City" },
      current: {
        temp_c: newTemp,
        humidity: newHumidity,
        wind_kph: parseFloat(newWind),
        uv: newUV,
        pressure_mb: newPressure,
        gust_kph: parseFloat(newGust),
        air_quality: {
          "us-epa-index": newAQI,
        },
      },
      forecast: newForecast,
    };
    setWeatherData(newWeatherData);
    setCurrentTemp(newTemp);
  };

=======
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

>>>>>>> BE_Weather
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

<<<<<<< HEAD
        <Pressable style={styles.iconBtn} onPress={refreshData}>
=======
        <Pressable style={styles.iconBtn} onPress={loadData}>
>>>>>>> BE_Weather
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

<<<<<<< HEAD
        {/* <View style={styles.bottomBar}>
          <View style={styles.fanSection}>
            <View style={styles.fanIconBg}>
              <Fan color="#5C6BC0" size={20} />
            </View>
            <Text style={styles.fanText}>Chất lượng không khí</Text>
          </View>
          <Text style={[styles.qualityValue, { color: aqiInfo.color }]}>
            {aqiInfo.text}
          </Text>
        </View> */}

=======
>>>>>>> BE_Weather
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
<<<<<<< HEAD
);

const getWeatherAdvice = (current, aqiInfo) => {
  const advice = [];

  if (aqiInfo?.advice) advice.push(aqiInfo.advice);

  if (current?.uv >= 8)
    advice.push("Tia UV rất cao, hạn chế ra ngoài 10h - 15h.");

  if (current?.humidity >= 85) advice.push("Độ ẩm cao, dễ oi bức và khó chịu.");

  if (current?.wind_kph >= 30)
    advice.push("Gió mạnh, chú ý khi di chuyển ngoài trời.");

  if (current?.gust_kph >= 45) advice.push("Có gió giật mạnh, nên cẩn thận.");

  if (current?.temp_c >= 35) advice.push("Nhiệt độ cao, nhớ bổ sung nước.");
  return advice.slice(0, 4);
};
=======
);
>>>>>>> BE_Weather
