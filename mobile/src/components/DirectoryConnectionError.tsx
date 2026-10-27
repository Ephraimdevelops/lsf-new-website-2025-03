import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { colors, type } from "../theme";

export function DirectoryConnectionError({ sw, retry }: { sw: boolean; retry: () => void }) {
  return <View style={styles.state} accessibilityRole="alert">
    <Text style={styles.title}>{sw ? "Hatukuweza kupakia orodha" : "Could not load the directory"}</Text>
    <Text style={styles.body}>{sw ? "Angalia muunganisho wa intaneti, kisha ujaribu tena. Hii haimaanishi kwamba hakuna huduma." : "Check your internet connection, then retry. This does not mean there are no services."}</Text>
    <Button label={sw ? "Jaribu tena" : "Retry"} variant="secondary" onPress={retry} />
  </View>;
}

const styles = StyleSheet.create({
  state: { paddingVertical: 24, gap: 12 },
  title: { fontFamily: type.semibold, fontSize: 17, color: colors.ink },
  body: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted },
});
