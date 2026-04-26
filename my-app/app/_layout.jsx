import "expo-standard-web-crypto";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";
import SafeScreen from "../components/SafeScreen";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const inAuthGroup = segments[0] === "(auth)";

      if (user && inAuthGroup) {
        router.replace("/(tabs)");
      }

      if (!user && !inAuthGroup) {
        router.replace("/(auth)/sign-up");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [segments]);

  if (loading) {
    return (
      <SafeScreen>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
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
