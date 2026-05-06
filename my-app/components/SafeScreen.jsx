import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        // paddingTop: insets.top, // Tránh notch/thanh trạng thái
        // paddingBottom: insets.bottom, // Tránh nút home ảo
        paddingLeft: insets.left, // Tránh viền cong (iPhone)
        paddingRight: insets.right, // Tránh viền cong (iPhone)
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
