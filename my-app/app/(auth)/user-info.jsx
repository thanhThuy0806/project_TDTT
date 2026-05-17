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
  Modal,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { authStyles } from "../../assets/styles/auth/auth.styles";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const MOBILITY_OPTIONS = [
  { id: "normal", label: "Bình thường", icon: "accessibility-outline" },
  { id: "wheelchair", label: "Sử dụng xe lăn", icon: "car-outline" },
  { id: "walking_difficulty", label: "Khó khăn đi lại", icon: "walk-outline" },
  { id: "blind", label: "Khiếm thị", icon: "eye-off-outline" },
  {
    id: "elderly_assisted",
    label: "Cần người trợ giúp",
    icon: "people-outline",
  },
];

const CONDITION_OPTIONS = [
  { id: "respiratory", label: "Bệnh hô hấp", icon: "leaf-outline" },
  { id: "heart_disease", label: "Bệnh tim mạch", icon: "heart-outline" },
  { id: "arthritis", label: "Viêm khớp", icon: "fitness-outline" },
  { id: "migraine", label: "Đau nửa đầu", icon: "pulse-outline" },
  { id: "asthma", label: "Hen suyễn", icon: "medkit-outline" },
  { id: "diabetes", label: "Tiểu đường", icon: "water-outline" },
];

const UserInfoForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "male",
    dob: new Date(),
    mobility: "normal",
    conditions: [],
    emergencyName: "",
    emergencyPhone: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState({
    mobility: false,
    conditions: false,
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange("dob", selectedDate);
    }
  };

  const toggleCondition = (id) => {
    const newConditions = formData.conditions.includes(id)
      ? formData.conditions.filter((item) => item !== id)
      : [...formData.conditions, id];
    handleInputChange("conditions", newConditions);
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
        mobility: formData.mobility,
        conditions: formData.conditions,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert("Thành công", "Đã cập nhật thông tin!");
      router.replace("/(tabs)/");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu dữ liệu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMobilityLabel = () => {
    const option = MOBILITY_OPTIONS.find((o) => o.id === formData.mobility);
    return option ? option.label : "Chọn hỗ trợ di chuyển";
  };

  const getConditionsLabel = () => {
    if (formData.conditions.length === 0) return "Không có bệnh trạng nào";
    if (formData.conditions.length === 1) {
      return CONDITION_OPTIONS.find((o) => o.id === formData.conditions[0])
        ?.label;
    }
    return `Đã chọn ${formData.conditions.length} bệnh trạng`;
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

          {/* ================= HỖ TRỢ DI CHUYỂN ================= */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Hỗ trợ di chuyển</Text>
            <View style={authStyles.inputWithIcon}>
              <Ionicons
                name="body-outline"
                size={20}
                color="#888"
                style={authStyles.inputIcon}
              />
              <TouchableOpacity
                style={authStyles.inputBox}
                onPress={() =>
                  setModalVisible({ ...modalVisible, mobility: true })
                }
              >
                <Text style={{ color: formData.mobility ? "#000" : "#999" }}>
                  {getMobilityLabel()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ================= BỆNH TRẠNG ================= */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Bệnh trạng (Tùy chọn)</Text>
            <View style={authStyles.inputWithIcon}>
              <Ionicons
                name="medical-outline"
                size={20}
                color="#888"
                style={authStyles.inputIcon}
              />
              <TouchableOpacity
                style={authStyles.inputBox}
                onPress={() =>
                  setModalVisible({ ...modalVisible, conditions: true })
                }
              >
                <Text
                  style={{
                    color: formData.conditions.length > 0 ? "#000" : "#999",
                  }}
                >
                  {getConditionsLabel()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={[
              authStyles.label,
              { textAlign: "left", marginBottom: 15, marginTop: 10 },
            ]}
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

      {/* ================= MODAL: HỖ TRỢ DI CHUYỂN (SINGLE SELECT) ================= */}
      <Modal visible={modalVisible.mobility} transparent animationType="fade">
        <TouchableOpacity
          style={customStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible({ ...modalVisible, mobility: false })}
        >
          <View style={customStyles.modalContent}>
            <View style={customStyles.modalHeader}>
              <Text style={customStyles.modalTitle}>Hỗ trợ di chuyển</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MOBILITY_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={customStyles.listItem}
                  onPress={() => {
                    handleInputChange("mobility", item.id);
                    setModalVisible({ ...modalVisible, mobility: false });
                  }}
                >
                  <View style={customStyles.listLeft}>
                    <Ionicons name={item.icon} size={22} color="#000085" />
                    <Text style={customStyles.listText}>{item.label}</Text>
                  </View>
                  <Ionicons
                    name={
                      formData.mobility === item.id
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={22}
                    color={formData.mobility === item.id ? "#000085" : "#CCC"}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= BỆNH TRẠNG (MULTI SELECT) ================= */}
      <Modal visible={modalVisible.conditions} transparent animationType="fade">
        <TouchableOpacity
          style={customStyles.modalOverlay}
          activeOpacity={1}
          onPress={() =>
            setModalVisible({ ...modalVisible, conditions: false })
          }
        >
          <View style={customStyles.modalContent}>
            <View style={customStyles.modalHeader}>
              <Text style={customStyles.modalTitle}>
                Các bệnh trạng cần lưu ý
              </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {CONDITION_OPTIONS.map((item) => {
                const isSelected = formData.conditions.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={customStyles.listItem}
                    onPress={() => toggleCondition(item.id)}
                  >
                    <View style={customStyles.listLeft}>
                      <Ionicons name={item.icon} size={22} color="#000085" />
                      <Text style={customStyles.listText}>{item.label}</Text>
                    </View>
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={22}
                      color={isSelected ? "#000085" : "#CCC"}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={customStyles.doneButton}
              onPress={() =>
                setModalVisible({ ...modalVisible, conditions: false })
              }
            >
              <Text style={customStyles.doneButtonText}>Xong</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const customStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    maxHeight: "80%",
  },
  modalHeader: {
    backgroundColor: "#efe9e3",
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000085",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  listLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  doneButton: {
    backgroundColor: "#000085",
    paddingVertical: 12,
    margin: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UserInfoForm;
