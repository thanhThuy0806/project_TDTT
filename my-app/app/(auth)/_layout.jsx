import { Redirect, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import SafeScreen from "../../components/SafeScreen";

export default function AuthRoutesLayout() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });

    return unsubscribe;
  }, []);

  if (user === undefined) return null;

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    <SafeScreen>
      <Slot />
    </SafeScreen>
  );
}
