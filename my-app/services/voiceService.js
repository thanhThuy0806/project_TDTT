import api from 'axios';
import { API_URL } from "./apiClient"; 

export const sendVoiceToBackend = async (uri) => {
  const formData = new FormData();
  
  // Tự động lấy đuôi file thực tế từ URI (thường là m4a)
  const fileExtension = uri.split('.').pop() || 'm4a';

  formData.append("file", {
    uri: uri,
    type: `audio/${fileExtension}`, // Để MIME type động cho an toàn
    name: `voice.${fileExtension}`,
  });

  try {
    const response = await api.post(`http://${API_URL}/voice`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Lỗi gửi file âm thanh:", error.response?.data || error.message);
    throw error;
  }
};