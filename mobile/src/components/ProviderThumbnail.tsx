import { Text, View } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { colors, type } from "../theme";

export function ProviderThumbnail({ kind, name, photoUri, publicPhoto = false, size = 72 }: { kind: string; name: string; photoUri?: string; publicPhoto?: boolean; size?: number }) {
  const [failedUri, setFailedUri] = useState<string>();
  const photo = !!photoUri && failedUri !== photoUri;
  const person = kind === "paralegal";
  const tile = ["government_office", "local_government", "court_or_tribunal", "labour_service", "land_service", "police_gender_children_desk"].includes(kind) ? 1
    : ["cso", "partner_organisation", "social_welfare", "mediation"].includes(kind) ? 2
    : ["protection_service", "police_gender_children_desk", "safe_house"].includes(kind) ? 3 : 0;
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size, flexShrink: 0, borderRadius: person ? size / 2 : 8, overflow: "hidden", backgroundColor: person ? colors.tealSoft : "#F3F5F4", alignItems: "center", justifyContent: "center" }}>
    {photo ? <Image source={{ uri: photoUri }} cachePolicy={publicPhoto ? "disk" : "none"} recyclingKey={photoUri} contentFit="cover" onError={() => setFailedUri(photoUri)} style={{ width: size, height: size }} /> : person ? <Text style={{ fontFamily: type.semibold, fontSize: 22, color: colors.teal }}>{name.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase()}</Text> : <Image source={require("../../assets/provider-places.webp")} contentFit="fill" style={{ position: "absolute", width: size * 2, height: size * 2, left: -(tile % 2) * size, top: -Math.floor(tile / 2) * size }} />}
  </View>;
}
