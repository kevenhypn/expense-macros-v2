import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

type StepDotsProps = {
  currentStep: number;
  totalSteps: number;
};

function Dot({ isActive }: { isActive: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isActive ? "#6C5CE7" : "#1E1E2A", {
      duration: 200,
    }),
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="h-2 flex-1 rounded-full"
    />
  );
}

export function StepDots({ currentStep, totalSteps }: StepDotsProps) {
  return (
    <View className="flex-row gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <Dot key={index} isActive={index + 1 <= currentStep} />
      ))}
    </View>
  );
}
