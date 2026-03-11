import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "success" | "danger" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const VARIANT_STYLES = {
  primary: {
    bg: "bg-accent",
    bgDisabled: "bg-accent/40",
    text: "text-white",
  },
  success: {
    bg: "bg-success",
    bgDisabled: "bg-success/40",
    text: "text-white",
  },
  danger: {
    bg: "bg-danger",
    bgDisabled: "bg-danger/40",
    text: "text-white",
  },
  ghost: {
    bg: "bg-borderAlt",
    bgDisabled: "bg-borderAlt/40",
    text: "text-primary",
  },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  children,
}: ButtonProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full p-4 rounded-xl items-center justify-center flex-row gap-2 ${
        disabled ? styles.bgDisabled : styles.bg
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <>
          <Text className={`font-bold text-base ${styles.text}`}>{label}</Text>
          {children}
        </>
      )}
    </Pressable>
  );
}
