import { BrandLoading } from '../src/components/BrandLoading';
import { useLanguage } from '../src/i18n';
import { useAuth } from "../src/auth";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { colors } from "../src/theme";

export default function SsoCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  const { locale } = useLanguage();
  if (!isLoaded) return <BrandLoading task="account" locale={locale} fullScreen/>;
  return <Redirect href={isSignedIn ? "/(tabs)" : "/sign-in"} />;
}
