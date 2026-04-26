import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FeatureCard from '../../components/FeatureCard';
import {styles} from "../../assets/styles/(home)/home.styles";

export default function HomeScreen() {
  // Quản lý trạng thái các tính năng (để demo nút gạt)
  const [activeFeatures, setActiveFeatures] = useState({
    sos: true,
    weather: false,
    map: false,
    tips: false
  });

  const toggleFeature = (key) => {
    setActiveFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header: Menu & Avatar */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="grid" size={24} color="#333" />
          </TouchableOpacity>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?u=emon' }} 
            style={styles.avatar} 
          />
        </View>

        {/* Lời chào */}
        <View style={styles.greeting}>
          <Text style={styles.hiText}>Hi Emon 👋</Text>
          <Text style={styles.welcomeText}>Chào mừng bạn đến với chuyến đi an toàn.</Text>
        </View>

        {/* Thanh tìm kiếm */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput placeholder="Tìm kiếm dịch vụ..." style={styles.searchInput} />
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tiêu đề danh mục */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Công cụ hỗ trợ</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>Thêm</Text>
            <Ionicons name="add-circle" size={16} color="#059669" />
          </TouchableOpacity>
        </View>

        {/* Lưới các thẻ (Grid) */}
        <View style={styles.grid}>
          <FeatureCard 
            title="Cảnh báo SOS" 
            subtitle="Đang sẵn sàng" 
            icon="shield-checkmark" 
            bgColor={activeFeatures.sos ? "#818CFF" : "#F0F0F0"} 
            isEnabled={activeFeatures.sos}
            onToggle={() => toggleFeature('sos')}
          />
          <FeatureCard 
            title="Thời tiết" 
            subtitle="Cập nhật 5 phút trước" 
            icon="cloudy-night" 
            bgColor={activeFeatures.weather ? "#FFCC80" : "#FFF3E0"} 
            isEnabled={activeFeatures.weather}
            onToggle={() => toggleFeature('weather')}
          />
          <FeatureCard 
            title="Bản đồ ngoại tuyến" 
            subtitle="Đã tải 2 vùng" 
            icon="map" 
            bgColor={activeFeatures.map ? "#80DEEA" : "#E0F7FA"} 
            isEnabled={activeFeatures.map}
            onToggle={() => toggleFeature('map')}
          />
          <FeatureCard 
            title="Sổ tay an toàn" 
            subtitle="7 quy tắc cơ bản" 
            icon="book" 
            bgColor={activeFeatures.tips ? "#C5E1A5" : "#F1F8E9"} 
            isEnabled={activeFeatures.tips}
            onToggle={() => toggleFeature('tips')}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

