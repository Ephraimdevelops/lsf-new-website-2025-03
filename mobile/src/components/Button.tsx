import { BrandLoadingMark } from './BrandLoading';
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, type } from "../theme";

type Props = ComponentProps<typeof Pressable> & {
  label: string;
  variant?: "primary" | "secondary" | "quiet";
  loading?: boolean;
};

export function Button({ label, variant = "primary", loading, disabled, style, ...props }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: Boolean(disabled || loading), busy: Boolean(loading)}}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...props}
    >
      {loading ? <BrandLoadingMark small light={variant === "primary"}/> : null}
      <Text style={[styles.label, variant !== "primary" && styles.altLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingHorizontal: spacing.xl,
  },
  primary: { backgroundColor: colors.burgundy },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.burgundy },
  quiet: { backgroundColor: colors.softPink },
  label: { color: colors.surface, fontFamily: type.bold, fontWeight: "700", fontSize: 16 },
  altLabel: { color: colors.burgundy },
  pressed: { opacity: 0.84 },
  disabled: { opacity: 0.48 },
});
