import { useState, useEffect } from "react";

export function useUserInfo(userId) {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập fetch data từ API/backend
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        // Thay bằng API call thực tế
        const savedData = localStorage.getItem(`user_${userId}`);
        if (savedData) {
          setUserInfo(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const saveUserInfo = async (data) => {
    try {
      // Thay bằng API call thực tế
      localStorage.setItem(`user_${userId}`, JSON.stringify(data));
      setUserInfo(data);
      setIsEditing(false);
      return true;
    } catch (error) {
      console.error("Error saving user info:", error);
      return false;
    }
  };

  const updateUserInfo = async (data) => {
    return saveUserInfo(data);
  };

  return {
    userInfo,
    isEditing,
    setIsEditing,
    isLoading,
    saveUserInfo,
    updateUserInfo,
  };
}
