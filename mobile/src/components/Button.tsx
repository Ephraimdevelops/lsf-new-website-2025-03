import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
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
      {loading ? <ActivityIndicator color={variant === "primary" ? colors.surface : colors.burgundy} /> : (
        <Text style={[styles.label, variant !== "primary" && styles.altLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xl,
  },
  primary: { backgroundColor: colors.burgundy },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.burgundy },
  quiet: { backgroundColor: colors.softPink },
  label: { color: colors.surface, fontFamily: type.bold, fontSize: 16 },
  altLabel: { color: colors.burgundy },
  pressed: { opacity: 0.84 },
  disabled: { opacity: 0.48 },
});

