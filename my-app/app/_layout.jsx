import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import SafeScreen from "../components/SafeScreen";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Xử lý điều hướng sau khi đã có user và loading xong
  useEffect(() => {
    if (loading) return;

    const checkNavigation = async () => {
      const inAuthGroup = segments[0] === "(auth)";

      if (!user) {
        if (!inAuthGroup) {
          router.replace("/sign-up");
        }
        return;
      }

      try {
        const userInfoRef = doc(db, "user-info", user.uid);
        const userInfoSnap = await getDoc(userInfoRef);
        const hasCompletedInfo =
          userInfoSnap.exists() && userInfoSnap.data().name?.trim();

        if (hasCompletedInfo) {
          if (inAuthGroup || segments[1] === 'user-info') {
            router.replace("/(tabs)");
          }
        } else {
          if (segments[1] !== "user-info") {
            router.replace("/user-info");
          }
        }
      } catch (error) {
        console.error("Error checking user info:", error);
      }
    };

    checkNavigation();
  }, [user, loading, segments]);

  if (loading) {
    return (
      <SafeScreen>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <Slot />
    </SafeScreen>
  );
}
