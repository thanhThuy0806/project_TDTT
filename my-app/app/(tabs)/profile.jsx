import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

import { styles } from "../../assets/styles/profile/profile.style";

const UserInfoScreen = () => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "male",
    dob: new Date(),
    emergencyName: "",
    emergencyPhone: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    selectedDate && handleInputChange("dob", selectedDate);
  };

  // Lấy dữ liệu từ Firestore
  const fetchUserInfo = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "user-info", currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          gender: data.gender || "male",
          dob: data.dob ? new Date(data.dob) : new Date(),
          emergencyName: data.emergencyName || "",
          emergencyPhone: data.emergencyPhone || "",
        });
      }
    } catch (error) {
      console.error("Lỗi tải thông tin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập họ và tên");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setSaving(true);
    try {
      await setDoc(
        doc(db, "user-info", currentUser.uid),
        {
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          dob: formData.dob.toISOString(),
          emergencyName: formData.emergencyName,
          emergencyPhone: formData.emergencyPhone,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      Alert.alert("Thành công", "Thông tin đã được cập nhật!");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thông tin");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => console.log("Đăng xuất..."),
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoSection}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>
                {formData.name || "Chưa cập nhật"}
              </Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Đang an toàn</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
          </View>

          <View style={styles.divider} />

          {/* Nút Chỉnh sửa */}
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={20} color="#3B82F6" />
              <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>
          )}

          <View style={styles.formSection}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Họ và tên</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <Text style={styles.valueText}>
                  {formData.name || "Chưa cập nhật"}
                </Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  keyboardType="phone-pad"
                  onChangeText={(text) => handleInputChange("phone", text)}
                />
              ) : (
                <Text style={styles.valueText}>
                  {formData.phone || "Chưa cập nhật"}
                </Text>
              )}
            </View>

            <View style={[styles.formGroup, { borderBottomWidth: 0 }]}>
              <Text style={styles.label}>Giới tính</Text>
              {isEditing ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
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
                        marginRight: 20,
                      }}
                    >
                      <View style={styles.checkBox}>
                        {formData.gender === item.value && (
                          <View style={styles.tick} />
                        )}
                      </View>
                      <Text style={{ fontSize: 16, color: "#333" }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.valueText}>
                  {formData.gender === "male"
                    ? "Nam"
                    : formData.gender === "female"
                    ? "Nữ"
                    : "Khác"}
                </Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ngày sinh</Text>
              {isEditing ? (
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#888"
                    style={styles.inputIcon}
                  />
                  <TouchableOpacity
                    style={styles.textInput}
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
              ) : (
                <Text style={styles.valueText}>
                  {formData.dob.toLocaleDateString("vi-VN")}
                </Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Người liên hệ khẩn cấp</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.emergencyName}
                  onChangeText={(text) =>
                    handleInputChange("emergencyName", text)
                  }
                  placeholder="Tên người thân"
                />
              ) : (
                <Text style={styles.valueText}>
                  {formData.emergencyName || "Chưa cập nhật"}
                </Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Số điện thoại khẩn cấp</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.emergencyPhone}
                  keyboardType="phone-pad"
                  onChangeText={(text) =>
                    handleInputChange("emergencyPhone", text)
                  }
                />
              ) : (
                <Text style={styles.valueText}>
                  {formData.emergencyPhone || "Chưa cập nhật"}
                </Text>
              )}
            </View>
          </View>

          {/* Nút Lưu & Hủy khi đang chỉnh sửa */}
          {isEditing && (
            <View style={styles.footerActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Nút Đăng xuất - Luôn hiển thị */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserInfoScreen;
