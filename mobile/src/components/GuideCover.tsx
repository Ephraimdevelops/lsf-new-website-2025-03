import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { radius, spacing } from '../theme';
export function GuideCover({ uri, description }: { uri?: string; description?: string }) {
 const [failedUri,setFailedUri]=useState<string>();
 if (!uri || failedUri===uri) return null;
 return <Image source={{uri}} accessibilityLabel={description} accessible={Boolean(description)} resizeMode="contain" onError={()=>setFailedUri(uri)} style={styles.image} />;
}
const styles=StyleSheet.create({image:{width:'100%',height:220,borderRadius:radius.lg,marginBottom:spacing.lg}});
