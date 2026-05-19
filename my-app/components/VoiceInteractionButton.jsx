import React, { useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import { useAudioRecorder, useAudioRecorderState, RecordingPresets, AudioModule } from "expo-audio";
import { sendVoiceToBackend } from "../services/voiceService";
import { checkSaftetyDetail } from "../services/warningService";
import { useVoiceStore } from "../store/useVoiceStore"; 

const { height } = Dimensions.get("window");
const SILENCE_THRESHOLD = -45; 
const SILENCE_TIMEOUT = 3000; 

export default function VoiceInteractionButton() {
  const { isRecording, setIsRecording, setRecordedUri } = useVoiceStore();

  const silenceTimer = useRef(null);
  const pulseVolume = useSharedValue(1); 
  const activeStateValue = useSharedValue(false);

  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recordingState = useAudioRecorderState(audioRecorder, 100);

  useEffect(() => {
    activeStateValue.value = isRecording;
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && recordingState?.metering !== undefined) {
      const metering = recordingState.metering;
      pulseVolume.value = withTiming(interpolate(metering, [-60, 0], [1, 2.5], "clamp"), { duration: 100 });

      if (metering < SILENCE_THRESHOLD) {
        if (!silenceTimer.current) {
          silenceTimer.current = Date.now(); 
        } else if (Date.now() - silenceTimer.current > SILENCE_TIMEOUT) {
          stopRecording(); 
        }
      } else {
        silenceTimer.current = null; 
      }
    }
  }, [recordingState?.metering, isRecording]);

  const startRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        alert("Cần cấp quyền Microphone để sử dụng tính năng này.");
        return;
      }
      setIsRecording(true);
      silenceTimer.current = null; 
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (err) {
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
        setRecordedUri(uri);
        
        try {
          // GỌI API VOICE
          const responseData = await sendVoiceToBackend(uri);
          // Đẩy toàn bộ data lên Store để hiện Pop-up
          useVoiceStore.getState().setBackendResponse(responseData); 
          
        } catch (apiError) {
          useVoiceStore.getState().resetVoiceState();
        }
      }
    } catch (err) {
      useVoiceStore.getState().resetVoiceState();
    }
  };

  const toggleAction = () => isRecording ? stopRecording() : startRecording();


  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(activeStateValue.value ? -height * 0.35 : 0, { damping: 22, stiffness: 140, mass: 0.8, overshootClamping: true }) }],
  }));

  const buttonStyle = useAnimatedStyle(() => {
    let bgColor = isRecording ? "#EF4444" : "#673AB7"; 
    return {
      transform: [{ scale: withSpring(activeStateValue.value ? 1.5 : 1) }],
      backgroundColor: withTiming(bgColor, { duration: 300 }),
      shadowColor: withTiming(bgColor, { duration: 300 }),
    };
  });

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseVolume.value }],
    backgroundColor: "rgba(239, 68, 68, 0.4)",
    opacity: isRecording ? 1 : 0,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(activeStateValue.value ? 1 : 0, { duration: 300 }),
  }));

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]} pointerEvents={isRecording ? "auto" : "none"}>
        <Text style={styles.listeningText}>Đang nghe...</Text>
        <Text style={styles.subText}>Chạm vào nút mic để kết thúc sớm</Text>
      </Animated.View>

      <Animated.View style={[styles.container, containerStyle]} pointerEvents="box-none">
        <Animated.View style={[styles.pulseRing, pulseStyle]} pointerEvents="none" />
        <TouchableOpacity activeOpacity={0.9} onPress={toggleAction}>
          <Animated.View style={[styles.button, buttonStyle]}>
            <Ionicons name="mic" size={30} color="#FFF" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255, 255, 255, 0.95)", justifyContent: "center", alignItems: "center", paddingBottom: 120, zIndex: 5 },
  listeningText: { fontSize: 32, fontWeight: "800", color: "#EF4444" },
  subText: { fontSize: 16, color: "#6B7280", marginTop: 8, fontWeight: "500" },
  container: { position: "absolute", bottom: 50, alignSelf: "center", justifyContent: "center", alignItems: "center", zIndex: 10 },
  button: { width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
  pulseRing: { position: "absolute", width: 64, height: 64, borderRadius: 32 },
});