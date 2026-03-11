import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

type SnackBarProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  visible: boolean;
};

export function SnackBar({
  message,
  actionLabel = "Undo",
  onAction,
  visible,
}: SnackBarProps) {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      exiting={FadeOutDown.duration(200)}
      className="absolute bottom-6 left-4 right-4 rounded-2xl bg-card border border-border px-4 py-3 flex-row items-center justify-between"
    >
      <Text className="text-sm text-primary">{message}</Text>
      {onAction && (
        <Pressable onPress={onAction} className="px-3 py-1" hitSlop={8}>
          <Text className="text-sm text-accent font-semibold">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
