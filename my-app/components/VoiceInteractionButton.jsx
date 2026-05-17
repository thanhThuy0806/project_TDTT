import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import { 
  useAudioRecorder, 
  useAudioRecorderState, 
  RecordingPresets, 
  AudioModule
} from "expo-audio";
import { sendVoiceToBackend } from "../services/voiceService"
import { useVoiceStore } from "../store/useVoiceStore"; 

const { height } = Dimensions.get("window");
const SILENCE_THRESHOLD = -45; 
const SILENCE_TIMEOUT = 3000; 

export default function VoiceInteractionButton() {
  const { 
    isRecording, 
    setIsRecording, 
    isAgentSpeaking, 
    setRecordedUri 
  } = useVoiceStore();

  const silenceTimer = useRef(null);
  const pulseVolume = useSharedValue(1); 
  const isActive = isRecording || isAgentSpeaking;
  const activeStateValue = useSharedValue(false);

  // Khởi tạo Audio Recorder
  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  
  // Lấy state động (cập nhật mỗi 100ms) để theo dõi âm lượng (metering)
  const recordingState = useAudioRecorderState(audioRecorder, 100);

  useEffect(() => {
    activeStateValue.value = isActive;
  }, [isActive]);

  // Đưa logic bắt âm lượng và tự động ngắt im lặng vào một useEffect độc lập theo dõi recordingState
  useEffect(() => {
    if (isRecording && recordingState?.metering !== undefined) {
      const metering = recordingState.metering;

      // Đồng bộ sóng âm với độ lớn âm thanh
      pulseVolume.value = withTiming(
        interpolate(metering, [-60, 0], [1, 2.5], "clamp"), 
        { duration: 100 }
      );

      // Kích hoạt bộ đếm thời gian nếu dưới ngưỡng im lặng
      if (metering < SILENCE_THRESHOLD) {
        if (!silenceTimer.current) {
          silenceTimer.current = Date.now(); 
        } else if (Date.now() - silenceTimer.current > SILENCE_TIMEOUT) {
          stopRecording(); 
        }
      } else {
        silenceTimer.current = null; // Cập nhật lại nếu người dùng nói tiếp
      }
    }
  }, [recordingState?.metering, isRecording]);

  const startRecording = async () => {
    try {
      // Dùng AudioModule của expo-audio để xin quyền
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        alert(`Cần cấp quyền Microphone để sử dụng tính năng này. lỗi là: ${permission.granted}`);
        return;
      }

      setIsRecording(true);
      silenceTimer.current = null; 

      // Bắt đầu ghi âm
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      
    } catch (err) {
      console.error("Lỗi khi bắt đầu thu âm:", err);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      pulseVolume.value = withTiming(1); 
      silenceTimer.current = null;

      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      
      if (uri) {
        // Cập nhật UI tạm thời
        setRecordedUri(uri);
        
        // Gửi ngay xuống Backend
        try {
          const responseData = await sendVoiceToBackend(uri);
          
          // Backend trả về JSON thành công -> Báo cho Zustand cập nhật toàn app
          // Zustand sẽ tự set isAgentSpeaking = true nếu có audio_url
          useVoiceStore.getState().setBackendResponse(responseData); 
          
        } catch (apiError) {
          console.log("Xử lý giọng nói thất bại.");
          useVoiceStore.getState().resetVoiceState();
        }
      }
    } catch (err) {
      console.error("Lỗi khi dừng thu âm:", err);
      useVoiceStore.getState().resetVoiceState();
    }
  };

  const toggleAction = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isAgentSpeaking) {
      startRecording();
    }
  };

  // ================= ANIMATIONS =================

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(activeStateValue.value ? -height * 0.35 : 0, {
            damping: 22,
            stiffness: 140,
            mass: 0.8,
            overshootClamping: true,
          }),
        },
      ],
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    let bgColor = "#673AB7"; 
    if (isRecording) bgColor = "#EF4444"; 
    else if (isAgentSpeaking) bgColor = "#0EA5E9"; 

    return {
      transform: [{ scale: withSpring(activeStateValue.value ? 1.5 : 1) }],
      backgroundColor: withTiming(bgColor, { duration: 300 }),
      shadowColor: withTiming(bgColor, { duration: 300 }),
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    let pulseColor = isAgentSpeaking ? "rgba(14, 165, 233, 0.4)" : "rgba(239, 68, 68, 0.4)";
    return {
      transform: [{ scale: pulseVolume.value }],
      backgroundColor: pulseColor,
      opacity: isRecording || isAgentSpeaking ? 1 : 0,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(activeStateValue.value ? 1 : 0, { duration: 300 }),
    };
  });

  return (
    <>
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={isActive ? "auto" : "none"}
      >
        <Text style={[styles.listeningText, isAgentSpeaking && { color: "#0EA5E9" }]}>
          {isRecording ? "Đang nghe..." : "Đang trả lời..."}
        </Text>
        <Text style={styles.subText}>
          {isRecording ? "Chạm vào nút mic để kết thúc sớm" : "Vui lòng đợi trong giây lát"}
        </Text>
      </Animated.View>

      <Animated.View
        style={[styles.container, containerStyle]}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.pulseRing, pulseStyle]} pointerEvents="none" />

        <TouchableOpacity activeOpacity={0.9} onPress={toggleAction}>
          <Animated.View style={[styles.button, buttonStyle]}>
            <Ionicons 
              name={isAgentSpeaking ? "volume-high" : "mic"} 
              size={30} 
              color="#FFF" 
            />
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
    paddingBottom: 120,
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
  },
});