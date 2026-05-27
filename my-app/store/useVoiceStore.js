import { create } from 'zustand';
import { API_URL } from '@/services/apiClient';
// NHỚ IMPORT API_URL của bạn vào đây, ví dụ:
// import { API_URL } from '../config'; 

export const useVoiceStore = create((set) => ({
  // --- INITIAL STATES (Chỉ để giá trị mặc định) ---
  isRecording: false,
  recordedUri: null,
  isPopupVisible: false,
  
  agentAudioUrl: null, // SỬA TẠI ĐÂY: Trả về null ban đầu
  agentContent: "", 
  lat: null,
  lng: null,
  footnote: "", 
  
  // [MỚI]: State lưu trữ tình huống khẩn cấp
  emergencyType: null, 
  isVoiceEnabled: true, 

  // --- ACTIONS (Hàm cập nhật) ---
  setIsRecording: (status) => set({ isRecording: status }),
  setRecordedUri: (uri) => set({ recordedUri: uri }),
  setIsVoiceEnabled: (status) => set({ isVoiceEnabled: status }),

  setBackendResponse: (data) => {
    if (data.type === 'router' && data.content) {
      set({ 
        navigationRoute: data.content,
        emergencyType: data.emergency_type || null 
      });
    } else {
      // SỬA TẠI ĐÂY: Logic nối chuỗi API_URL được chuyển vào đúng hàm có biến 'data'
      // Vì backend đã trả về link hoàn chỉnh, ta gán trực tiếp luôn
      const audioUrl = data.audio_url ? data.audio_url : null;

      set({
        agentAudioUrl: audioUrl,
        agentContent: data.content || "",
        lat: data.lat || null,
        lng: data.lng || null,
        footnote: data.footnote || "",
        emergencyType: data.emergency_type || null, 
        isPopupVisible: true,
        isVoiceEnabled: true,
      });
    }
  },

  closePopup: () => set({
    isPopupVisible: false,
    agentAudioUrl: null,
    agentContent: "",
    lat: null,
    lng: null,
    footnote: ""
  }),

  resetVoiceState: () => set({
    isRecording: false,
    recordedUri: null,
    navigationRoute: null,
  }),

  clearEmergencyType: () => set({ emergencyType: null }),
}));