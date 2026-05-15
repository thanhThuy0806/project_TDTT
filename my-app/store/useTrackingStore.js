// store/useTrackingStore.js
import { create } from 'zustand';

export const useTrackingStore = create((set) => ({
  isTracking: true, // Trạng thái mặc định khi mới mở app
  toggleTracking: () => set((state) => ({ isTracking: !state.isTracking })),
  setIsTracking: (value) => set({ isTracking: value }),
}));