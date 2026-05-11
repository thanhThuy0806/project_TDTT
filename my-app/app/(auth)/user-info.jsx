import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { authStyles } from "../../assets/styles/auth/auth.styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const UserInfoForm = () => {
  // const { userId } = useLocalSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "male",
    dob: new Date(),
    emergencyName: "",
    emergencyPhone: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange("dob", selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert("Lỗi", "Phiên đăng nhập đã hết hạn. Vui lòng thử lại.");
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, "user-info", currentUser.uid);
      await setDoc(userDocRef, {
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob.toISOString(),
        phone: formData.phone,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert("Thành công", "Đã cập nhật thông tin!");
      router.replace("/(tabs)/index");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu dữ liệu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.keyboardView}
    >
      <ScrollView
        style={{ backgroundColor: "#FFFFFF" }}
        contentContainerStyle={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={authStyles.title}>Thông tin cá nhân</Text>

        <View style={authStyles.formContainer}>
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Họ và Tên</Text>
            <View style={authStyles.inputWithIcon}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#888"
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.inputBox}
                placeholder="Họ và tên"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            </View>
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Số Điện Thoại</Text>
            <View style={authStyles.inputWithIcon}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#888"
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.inputBox}
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
              />
            </View>
          </View>

          <View style={[authStyles.inputContainer, { borderBottomWidth: 0 }]}>
            <Text style={authStyles.label}>Giới tính</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {[
                { label: "Nam", value: "male" },
                { label: "Nữ", value: "female" },
                { label: "Khác", value: "other" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleInputChange("gender", item.value)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 15,
                  }}
                >
                  <View style={authStyles.checkBox}>
                    {formData.gender === item.value && (
                      <View style={authStyles.tick} />
                    )}
                  </View>
                  <Text style={{ fontSize: 16, color: "#333" }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Ngày Sinh</Text>
            <View style={authStyles.inputWithIcon}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#888"
                style={authStyles.inputIcon}
              />
              <TouchableOpacity
                style={authStyles.inputBox}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{formData.dob.toLocaleDateString("vi-VN")}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.dob}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
          </View>

          <Text
            style={[authStyles.label, { textAlign: "left", marginBottom: 15 }]}
          >
            Liên hệ của người thân
          </Text>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Họ và Tên</Text>
            <View style={authStyles.inputWithIcon}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#888"
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.inputBox}
                placeholder="Tên người thân"
                value={formData.emergencyName}
                onChangeText={(text) =>
                  handleInputChange("emergencyName", text)
                }
              />
            </View>
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Số Điện Thoại</Text>
            <View style={authStyles.inputWithIcon}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#888"
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.inputBox}
                placeholder="SĐT người thân"
                keyboardType="phone-pad"
                value={formData.emergencyPhone}
                onChangeText={(text) =>
                  handleInputChange("emergencyPhone", text)
                }
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              authStyles.authButton,
              loading && authStyles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Đang lưu thông tin..." : "Lưu thông tin"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserInfoForm;
