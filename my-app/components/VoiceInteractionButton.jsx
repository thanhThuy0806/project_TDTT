import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import api from "@/constants/api";
import { sendVoiceToBackend } from "@/services/voiceService";

const { height } = Dimensions.get("window");

export default function VoiceInteractionButton({ isRecording }) {
  // Biến bảo vệ phòng trường hợp quên truyền prop
  const fallbackRecording = useSharedValue(false);
  const safeRecordingState = isRecording || fallbackRecording;

  const [active, setActive] = useState(false);
  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0);

  const [recording, setRecording] = useState(null);
  const [processing, setProcessing] = useState(false);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    const currentRecording = recording;
    setRecording(undefined);
    await currentRecording.stopAndUnloadAsync();
    const uri = currentRecording.getURI();
    const result = await sendVoiceToBackend(uri);
    await handleBackendResponse(result);
  }

  const toggleRecording = () => {
    const nextState = !active;
    setActive(nextState);
    safeRecordingState.value = nextState;

    if (nextState) {
      startRecording();
      pulse1.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
      setTimeout(() => {
        if (safeRecordingState.value) {
          pulse2.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            false
          );
        }
      }, 750);
    } else {
      stopRecording();
      pulse1.value = 0;
      pulse2.value = 0;
    }
  };

  const handleBackendResponse = async (result) => {
    const { sound } = await Audio.Sound.createAsync({
      uri: `http://192.168.1.5:8000/${result.audio}`,
    });
    await sound.playAsync();

    if (result.type === "map") {
      console.log(result.location);
    } else if (result.type === "place") {
      console.log(result.text);
    } else {
      alert(result.text);
    }
  };

  // 1. Hoạt ảnh kéo nút lên cao (dùng lò xo withSpring cho tự nhiên)
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(
            safeRecordingState.value ? -height * 0.35 : 0,
            {
              damping: 22,
              stiffness: 140,
              mass: 0.8,
              overshootClamping: true,
            }
          ),
        },
      ],
    };
  });

  // 2. Hoạt ảnh phóng to nút và đổi sang màu đỏ
  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(safeRecordingState.value ? 1.5 : 1) }],
      backgroundColor: withTiming(
        safeRecordingState.value ? "#EF4444" : "#673AB7",
        { duration: 300 }
      ),
      shadowColor: withTiming(
        safeRecordingState.value ? "#EF4444" : "#673AB7",
        { duration: 300 }
      ),
    };
  });

  // 3. Hoạt ảnh xung sóng lan tỏa (Pulse)
  const pulse1Style = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(pulse1.value, [0, 1], [1, 3], "clamp") },
      ],
      opacity: interpolate(pulse1.value, [0, 1], [0.4, 0], "clamp"),
    };
  });

  const pulse2Style = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(pulse2.value, [0, 1], [1, 3], "clamp") },
      ],
      opacity: interpolate(pulse2.value, [0, 1], [0.4, 0], "clamp"),
    };
  });

  // 4. Màn mờ che phần nội dung phía sau khi đang thu âm
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(safeRecordingState.value ? 1 : 0, { duration: 300 }),
    };
  });

  return (
    <>
      {/* Lớp nền mờ */}
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={active ? "auto" : "none"}
      >
        <Text style={styles.listeningText}>Đang nghe...</Text>
        <Text style={styles.subText}>Chạm vào nút mic để kết thúc</Text>
      </Animated.View>

      {/* Cụm Nút và Sóng âm */}
      <Animated.View
        style={[styles.container, containerStyle]}
        pointerEvents="box-none"
      >
        {/* Render 2 vòng sóng */}
        <Animated.View
          style={[styles.pulseRing, pulse1Style]}
          pointerEvents="none"
        />
        <Animated.View
          style={[styles.pulseRing, pulse2Style]}
          pointerEvents="none"
        />

        {/* Nút Mic chính */}
        <TouchableOpacity activeOpacity={0.9} onPress={toggleRecording}>
          <Animated.View style={[styles.button, buttonStyle]}>
            <Ionicons name="mic" size={30} color="#FFF" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120, // Căn chữ nằm trên nút
    zIndex: 5,
  },
  listeningText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#EF4444",
  },
  subText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    fontWeight: "500",
  },
  container: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  pulseRing: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EF4444",
  },
});
