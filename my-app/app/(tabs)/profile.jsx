import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {styles} from "../../assets/styles/home/profile.style";


const UserInfoScreen = () => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    firstName: "Sienna",
    lastName: "Hewitt",
    email: "sienna.travel@gmail.com",
    country: "United States",
    emergencyPhone: "+1 234 567 890",
  });

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
          {/* Card chứa toàn bộ nội dung */}
          <View style={styles.card}>
            {/* 1. Ảnh bìa (Cover Image) */}
            <View style={styles.coverContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1506744626753-eba7bc81541e?q=80&w=800&auto=format&fit=crop",
                }}
                style={styles.coverImage}
              />
              <TouchableOpacity style={styles.closeButton}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* 2. Avatar & Nút hành động trên cùng */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1531123897727-8f129e1bf00c?q=80&w=200&auto=format&fit=crop",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={20}
                    color="#3B82F6"
                  />
                </View>
              </View>

              <View style={styles.topActions}>
                <TouchableOpacity style={styles.outlineButton}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={16}
                    color="#374151"
                  />
                  <Text style={styles.outlineButtonText}>Bảo mật</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outlineButton}>
                  <Text style={styles.outlineButtonText}>Lịch sử đi</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Tên & Trạng thái */}
            <View style={styles.infoSection}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>Sienna Hewitt</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Đang an toàn</Text>
                </View>
              </View>
              <Text style={styles.userEmail}>{formData.email}</Text>
            </View>

            {/* 4. Thống kê Du lịch (Travel Stats) */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Chuyến đi</Text>
                <Text style={styles.statValue}>12</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Điểm an toàn</Text>
                <Text style={styles.statValue}>5</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Nhóm máu</Text>
                <Text style={styles.statValue}>O+</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Liên hệ SOS</Text>
                <Text style={styles.statValue}>3</Text>
              </View>
            </View>

            {/* Đường gạch ngang phân cách */}
            <View style={styles.divider} />

            {/* 5. Form nhập liệu */}
            <View style={styles.formSection}>
              {/* Họ & Tên (Hàng ngang) */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Họ và Tên</Text>
                <View style={styles.rowInputs}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                    value={formData.firstName}
                    placeholder="Tên"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={formData.lastName}
                    placeholder="Họ"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Địa chỉ Email</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#6B7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.inputField}
                    value={formData.email}
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.verifiedRow}>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={16}
                    color="#3B82F6"
                  />
                  <Text style={styles.verifiedText}>
                    ĐÃ XÁC MINH 2 THG 1, 2025
                  </Text>
                </View>
              </View>

              {/* Quốc gia */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Quốc gia (Country)</Text>
                <TouchableOpacity style={styles.inputDropdown}>
                  <Text style={styles.dropdownText}>🇺🇸 {formData.country}</Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Số điện thoại khẩn cấp (Thay cho Username) */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Số điện thoại khẩn cấp (SOS)</Text>
                <View style={styles.inputWithPrefix}>
                  <View style={styles.prefixBox}>
                    <Text style={styles.prefixText}>SOS</Text>
                  </View>
                  <TextInput
                    style={styles.inputFieldPrefixed}
                    value={formData.emergencyPhone}
                    keyboardType="phone-pad"
                  />
                  <Ionicons
                    name="shield-checkmark"
                    size={20}
                    color="#3B82F6"
                    style={{ marginRight: 12 }}
                  />
                </View>
              </View>
            </View>

            {/* 6. Nút Lưu thay đổi */}
            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 7. NÚT ĐĂNG XUẤT (Thêm mới vào đây) */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => console.log("User logged out")}
          >
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
