import React from "react";
import { View, Text } from "react-native";

type EmptyStateProps = {
  title: string;
  subtitle?: string;
};

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="items-center py-10 gap-2">
      <Text className="text-center text-secondary text-base">{title}</Text>
      {subtitle && (
        <Text className="text-center text-secondary/60 text-xs">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
