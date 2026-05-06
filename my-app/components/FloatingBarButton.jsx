import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {styles } from '../assets/styles/components/floating-bar-button.style'

export default function FloatingBarButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.button}>
        {/* Icon scan tương tự hình ảnh tham chiếu */}
        <Ionicons name="mic-outline" size={24} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}