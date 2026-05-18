import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput, // Import TextInput
} from "react-native";
import {
  ShieldCheck,
  AlertTriangle,
  Siren,
  ArrowLeft,
  Search, // Import icon Search (Kính lúp)
} from "lucide-react-native";
import { useRouter } from "expo-router";

// Tự động load SafeMap.web.jsx trên Web, và SafeMap.jsx trên Mobile
import SafeMap from "../../components/SafeMap";
import * as Location from "expo-location";
import { getSafetyDetail, checkSaftetyDetail } from "@/services/warningService";

const { width, height } = Dimensions.get("window");

export default function SafetyDetails() {
  const router = useRouter();
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });
  const [severity, setSeverity] = useState("safe");
  const [tags, setTags] = useState([]);
  // State cho chức năng tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchLocationAndSafetyData() {
      try {
        // 1. Lấy vị trí
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Quyền truy cập vị trí bị từ chối");
          return;
        }

        let result = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced, // Dùng Balanced cho nhẹ và nhanh hơn khi test
        });

        const currentLat = result.coords.latitude;
        const currentLng = result.coords.longitude;

        // Cập nhật State cho Map hiển thị
        setCoords({
          latitude: currentLat,
          longitude: currentLng,
        });

        // Gọi API NGAY LẬP TỨC
        const data = await getSafetyDetail(currentLat, currentLng);

        // 3. Ánh xạ đúng trường dữ liệu từ Backend trả về
        // Backend trả về: { status: "safe", alerts: [{ text: "..." }] }
        setSeverity(data.status);

        // Trích xuất list chuỗi từ mảng object alerts
        if (data.alerts && data.alerts.length > 0) {
          const extractedTags = data.alerts.map((alert) => alert.text);
          setTags(extractedTags);
        } else {
          setTags([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin an toàn:", error);
      }
    }

    fetchLocationAndSafetyData();
  }, []);

  // Hàm xử lý khi người dùng bấm nút tìm kiếm
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const data = await checkSaftetyDetail(searchQuery);
      console.log(data)

      // Ánh xạ lại dữ liệu trả về giống như useEffect
      setSeverity(data.status);
      
      if (data.alerts && data.alerts.length > 0) {
        const extractedTags = data.alerts.map((alert) => alert.text);
        setTags(extractedTags);
      } else {
        setTags([]);
      }

      // Tùy chọn: Nếu API trả về cả lat, lng của địa điểm vừa tìm kiếm, ta dời bản đồ tới đó
      if (data.lat && data.lng) {
        setCoords({ latitude: data.lat, longitude: data.lng });
      }

    } catch (error) {
      console.error("Lỗi khi tìm kiếm địa điểm:", error);
    }
  };

  const getSeverityConfig = (level) => {
    switch (level) {
      case "high":
        return {
          title: "Nguy Hiểm",
          color: "#D32F2F",
          Icon: Siren,
          bgColor: "#FFEBEE",
        };
      case "medium":
        return {
          title: "Cảnh Giác",
          color: "#F57C00",
          Icon: AlertTriangle,
          bgColor: "#FFF3E0",
        };
      case "low":
      default:
        return {
          title: "An Toàn",
          color: "#2E7D32",
          Icon: ShieldCheck,
          bgColor: "#E8F5E9",
        };
    }
  };

  const config = getSeverityConfig(severity);
  const { Icon } = config;

  return (
    <View style={styles.container}>
      {/* 1. Phần Hero Banner (Bản đồ) - Mã nguồn đã trở nên cực kỳ gọn gàng */}
      <View style={styles.mapContainer}>
        <SafeMap latitude={coords.latitude} longitude={coords.longitude} />
      </View>

      {/* 2. Nút Quay lại (Góc trái trên) */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(tabs)")}
      >
        <ArrowLeft size={24} color="#1E293B" />
      </TouchableOpacity>

      {/* 3. Phần Card thông tin */}
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            
            {/* [MỚI] Search Bar mang phong cách bo tròn của Chrome */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Kiểm tra địa điểm"
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch} // Chạy tìm kiếm khi bấm Enter/Done trên bàn phím
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Search size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={[styles.iconBox, { backgroundColor: config.bgColor }]}>
              <Icon size={32} color={config.color} />
            </View>
            <Text style={[styles.severityTitle, { color: config.color }]}>
              {config.title}
            </Text>
            <Text style={styles.locationSubtitle}>
              Thông tin tại vị trí hiện tại
            </Text>
          </View>

          <View style={styles.divider} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tagsGrid}
          >
            {tags.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  mapContainer: {
    width: "100%",
    height: height * 0.45,
    position: "absolute",
    top: 0,
    backgroundColor: "#E2E8F0",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 10,
  },
  cardWrapper: {
    flex: 1,
    marginTop: height * 0.38,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  cardHeader: { 
    alignItems: "center", 
    marginBottom: 20 
  },
  
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 2,
    height: 50,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#334155",
  },
  searchButton: {
    padding: 4,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  severityTitle: { fontSize: 26, fontWeight: "bold" },
  locationSubtitle: { fontSize: 15, color: "#64748B" },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    width: "100%",
    marginBottom: 20,
  },
  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tagItem: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "center",
  },
  tagText: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
    textAlign: "center",
  },
});