import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { styles } from "../../assets/styles/profile/profile.style";

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

const UserInfoScreen = () => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState({
    mobility: false,
    conditions: false,
  });

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    selectedDate && handleInputChange("dob", selectedDate);
  };

  const toggleCondition = (id) => {
    const newConditions = formData.conditions.includes(id)
      ? formData.conditions.filter((item) => item !== id)
      : [...formData.conditions, id];
    handleInputChange("conditions", newConditions);
  };

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
          mobility: data.mobility || "normal",
          conditions: data.conditions || [],
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
          mobility: formData.mobility,
          conditions: formData.conditions,
          emergencyName: formData.emergencyName,
          emergencyPhone: formData.emergencyPhone,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
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

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          router.push('/(auth)/sign-up')
          await AsyncStorage.removeItem("token")
          await signOut(auth)
        },
      },
    ]);
  };

  const getMobilityLabel = () => {
    const option = MOBILITY_OPTIONS.find((o) => o.id === formData.mobility);
    return option ? option.label : "Bình thường";
  };

  const getConditionsLabel = () => {
    if (!formData.conditions || formData.conditions.length === 0)
      return "Không có";
    if (formData.conditions.length === 1) {
      return CONDITION_OPTIONS.find((o) => o.id === formData.conditions[0])
        ?.label;
    }
    return `Đã chọn ${formData.conditions.length} bệnh trạng`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
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

            {/* --- HỖ TRỢ DI CHUYỂN --- */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Hỗ trợ di chuyển</Text>
              {isEditing ? (
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="body-outline"
                    size={20}
                    color="#888"
                    style={styles.inputIcon}
                  />
                  <TouchableOpacity
                    style={styles.textInput}
                    onPress={() =>
                      setModalVisible({ ...modalVisible, mobility: true })
                    }
                  >
                    <Text>{getMobilityLabel()}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.valueText}>{getMobilityLabel()}</Text>
              )}
            </View>

            {/* --- BỆNH TRẠNG --- */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Bệnh trạng</Text>
              {isEditing ? (
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="medical-outline"
                    size={20}
                    color="#888"
                    style={styles.inputIcon}
                  />
                  <TouchableOpacity
                    style={styles.textInput}
                    onPress={() =>
                      setModalVisible({ ...modalVisible, conditions: true })
                    }
                  >
                    <Text>{getConditionsLabel()}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.valueText}>{getConditionsLabel()}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Người liên hệ khẩn cấp</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.emergencyName}
                  onChangeText={(text) => handleInputChange("emergencyName", text)}
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
                  onChangeText={(text) => handleInputChange("emergencyPhone", text)}
                />
              ) : (
                <Text style={styles.valueText}>
                  {formData.emergencyPhone || "Chưa cập nhật"}
                </Text>
              )}
            </View>
          </View>

          {isEditing && (
            <View style={styles.footerActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditing(false);
                  fetchUserInfo();
                }}
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

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ================= MODAL: HỖ TRỢ DI CHUYỂN ================= */}
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

      {/* ================= MODAL: BỆNH TRẠNG ================= */}
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
    </SafeAreaView>
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

export default UserInfoScreen;
