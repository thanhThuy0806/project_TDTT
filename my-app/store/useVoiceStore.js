// store/useVoiceStore.js
import { create } from 'zustand';

export const useVoiceStore = create((set) => ({
  isRecording: false,
  isAgentSpeaking: false,
  recordedUri: null,        // Đường dẫn file âm thanh vừa thu xong
  agentAudioUrl: null,      // Đường dẫn file âm thanh LLM trả về
  navigationRoute: null,    // Lệnh điều hướng (VD: '/weather')

  // Các hàm cập nhật trạng thái
  setIsRecording: (status) => set({ isRecording: status }),
  setIsAgentSpeaking: (status) => set({ isAgentSpeaking: status }),
  
  // Hàm lưu kết quả thu âm
  setRecordedUri: (uri) => set({ recordedUri: uri }),
  
  // Hàm xử lý kết quả từ Backend trả về
  setBackendResponse: (data) => {
    if (data.type === 'router' && data.content) {
      // Nếu là điều hướng -> Cập nhật route để index.jsx bắt sự kiện
      set({ navigationRoute: data.content, isAgentSpeaking: false });
    } else {
      // Nếu là text/audio -> Cập nhật URL và bật chế độ Agent Speaking
      set({ 
        agentAudioUrl: data.audio_url || null, 
        isAgentSpeaking: !!data.audio_url 
      });
    }
  },

  // Hàm reset trạng thái khi hoàn thành
  resetVoiceState: () => set({ 
    isRecording: false, 
    isAgentSpeaking: false, 
    recordedUri: null, 
    agentAudioUrl: null, 
    navigationRoute: null 
  }),
}));