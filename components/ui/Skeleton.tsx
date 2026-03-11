import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
};

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={{ width: width as number, height, borderRadius, overflow: "hidden" }}>
      <Animated.View
        style={[
          {
            width: "100%",
            height: "100%",
            backgroundColor: "#2A2A3A",
            borderRadius,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
