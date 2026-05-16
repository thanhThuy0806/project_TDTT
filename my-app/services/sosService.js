import * as Location from "expo-location";
import * as SMS from "expo-sms";
import { Linking, Platform } from "react-native";
import api from "./apiClient";

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }

    const locationData = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return locationData.coords;
  } catch (error) {
    console.log("Lỗi GPS:", error);
    throw error;
  }
};

export const searchRescueUnit = async ({ lat, lng, emergencyType }) => {
  try {
    const response = await api.post("/sos/search", {
      lat,
      lng,
      emergency_type: emergencyType,
    });

    return response.data;
  } catch (error) {
    console.log("Lỗi API SOS:", error?.response?.data || error);

    throw new Error("SOS_API_ERROR");
  }
};

export const buildSOSMessage = ({
  data,
  lat,
  lng,
  emergencyType,
  emergencyTypes,
}) => {
  const unitName = data?.unit?.name || "Đơn vị cứu hộ";
  const unitAddress = data?.unit?.address || "";

  const rescueInfo =
    data?.status === "success" && data?.unit
      ? `Đơn vị cứu trợ gần nhất: ${unitName} - ${unitAddress}`
      : "Đang chờ cứu hộ...";

  const typeLabel =
    emergencyTypes.find((t) => t.id === emergencyType)?.label || "Khẩn cấp";

  const userLocation = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const searchQuery = encodeURIComponent(`${unitName} ${unitAddress}`);

  return (
    `[SOS - ${typeLabel.toUpperCase()}] Tôi đang gặp sự cố!\n` +
    `${rescueInfo}\n` +
    `Vị trí của tôi: ${userLocation}\n` +
    `Đường đi đến đơn vị: ` +
    `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
  );
};

export const sendEmergencySMS = async ({ phone, message }) => {
  try {
    const isAvailable = await SMS.isAvailableAsync();

    if (Platform.OS === "web") {
      const url = `sms:${phone}?body=${encodeURIComponent(message)}`;

      return Linking.openURL(url);
    }

    if (!isAvailable) {
      throw new Error("SMS_NOT_AVAILABLE");
    }

    return await SMS.sendSMSAsync([phone], message);
  } catch (error) {
    console.log("Lỗi SMS:", error);
    throw error;
  }
};
