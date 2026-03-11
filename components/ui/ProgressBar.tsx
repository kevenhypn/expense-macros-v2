import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ANIMATION } from "@/constants/theme";

type ProgressBarProps = {
  progress: number; // 0-100
  color: string;
  height?: number;
  trackColor?: string;
};

export function ProgressBar({
  progress,
  color,
  height = 8,
  trackColor = "#1A1A2E",
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(100, Math.max(0, progress)), {
      duration: ANIMATION.duration.slow,
    });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: color,
    height,
    borderRadius: height / 2,
  }));

  return (
    <View
      style={{
        height,
        backgroundColor: trackColor,
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <Animated.View style={animatedStyle} />
    </View>
  );
}
