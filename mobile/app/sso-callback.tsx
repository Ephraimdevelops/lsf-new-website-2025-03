import { useAuth } from "../src/auth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../src/theme";

export default function SsoCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator color={colors.burgundy} /></View>;
  return <Redirect href={isSignedIn ? "/(tabs)" : "/sign-in"} />;
}
