import api from "../constants/api";

export const sendVoiceToBackend = async (uri) => {
  const formData = new FormData();

  formData.append("file", {
    uri,
    type: "audio/m4a",
    name: "voice.m4a",
  });

  const response = await api.post("/voice", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
