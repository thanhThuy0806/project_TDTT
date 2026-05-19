import { create } from 'zustand';

export const useVoiceStore = create((set) => ({
  isRecording: false,
  recordedUri: null,
  
  isPopupVisible: false,
  agentAudioUrl: null,
  agentContent: "", 
  lat: null,
  lng: null,
  footnote: "", 
  
  isVoiceEnabled: true, 

  setIsRecording: (status) => set({ isRecording: status }),
  setRecordedUri: (uri) => set({ recordedUri: uri }),
  setIsVoiceEnabled: (status) => set({ isVoiceEnabled: status }),

  setBackendResponse: (data) => {
    if (data.type === 'router' && data.content) {
      set({ navigationRoute: data.content });
    } else {
      set({
        agentAudioUrl: data.audio_url || null,
        agentContent: data.content || "",
        lat: data.lat || null,
        lng: data.lng || null,
        footnote: data.footnote || "",
        
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
}));