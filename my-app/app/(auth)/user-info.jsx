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
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { authStyles } from "../../assets/styles/auth/auth.styles";
import { API_URL } from "../../constants/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const UserInfoForm = () => {
  const { userId } = useLocalSearchParams();
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
    setLoading(true);
    try {
      const userDocRef = doc(db, "user-info", userId);
      await setDoc(userDocRef, {
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob.toISOString(), // Lưu ISO string để dễ truy vấn
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
      <ScrollView contentContainerStyle={authStyles.scrollContent}>
        <Text style={authStyles.title}>Thông tin cá nhân</Text>

        <View style={authStyles.formContainer}>
          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Họ và tên"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
          </View>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
            />
          </View>

          <View
            style={[
              authStyles.inputContainer,
              { borderWidth: 1, borderColor: "#ccc", borderRadius: 12 },
            ]}
          >
            <Picker
              selectedValue={formData.gender}
              onValueChange={(itemValue) =>
                handleInputChange("gender", itemValue)
              }
              style={{ height: 55 }}
            >
              <Picker.Item label="Nam" value="male" />
              <Picker.Item label="Nữ" value="female" />
              <Picker.Item label="Khác" value="other" />
            </Picker>
          </View>

          <View style={authStyles.inputContainer}>
            <TouchableOpacity
              style={authStyles.textInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: formData.dob ? "#000" : "#999" }}>
                Ngày sinh: {formData.dob.toLocaleDateString("vi-VN")}
              </Text>
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

          <Text
            style={[
              authStyles.subtitle,
              { textAlign: "left", marginBottom: 15 },
            ]}
          >
            Liên hệ khẩn cấp
          </Text>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Tên người thân"
              value={formData.emergencyName}
              onChangeText={(text) => handleInputChange("emergencyName", text)}
            />
          </View>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="SĐT người thân"
              keyboardType="phone-pad"
              value={formData.emergencyPhone}
              onChangeText={(text) => handleInputChange("emergencyPhone", text)}
            />
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
              {loading ? "Saving Information..." : "Save Information"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserInfoForm;
