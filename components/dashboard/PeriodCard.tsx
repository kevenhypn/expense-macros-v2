import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { formatMoney } from "@/lib/format";
import { getResetDateLabel } from "@/lib/dates";

type PeriodCardProps = {
  periodLeft: number;
  availableToSpend: number;
  discretionarySpent: number;
  overspentDays: number;
  rolloverUnspent: boolean;
  daysLeftInMonth: number;
  selectedDateISO: string;
  isExpanded: boolean;
  onToggle: () => void;
};

export function PeriodCard({
  periodLeft,
  availableToSpend,
  discretionarySpent,
  overspentDays,
  rolloverUnspent,
  daysLeftInMonth,
  selectedDateISO,
  isExpanded,
  onToggle,
}: PeriodCardProps) {
  const resetLabel = getResetDateLabel(selectedDateISO);
  const isPositive = periodLeft >= 0;

  return (
    <Pressable onPress={onToggle}>
      <Animated.View
        layout={LinearTransition.duration(200)}
        className="bg-card border border-border rounded-3xl p-5 gap-2"
      >
        <Text className="text-secondary text-sm uppercase tracking-wider font-semibold">
          Left this month
        </Text>
        <View className="flex-row justify-between items-baseline">
          <Text
            className={`text-3xl font-bold ${
              isPositive ? "text-success" : "text-danger"
            }`}
          >
            {formatMoney(periodLeft)}
          </Text>
          <Text className="text-secondary text-sm font-medium">
            {formatMoney(availableToSpend)} budget {"  "}
            {daysLeftInMonth} days left
          </Text>
        </View>
        <Text className="text-xs text-secondary mt-1">
          {resetLabel} {"  "} Tap for details
        </Text>

        {isExpanded && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            className="mt-4 pt-4 border-t border-border gap-3"
          >
            <View className="flex-row justify-between">
              <Text className="text-xs text-secondary">Left this month</Text>
              <Text
                className={`text-sm font-semibold ${
                  isPositive ? "text-success" : "text-danger"
                }`}
              >
                {formatMoney(periodLeft)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-secondary">Spent so far</Text>
              <Text className="text-sm font-semibold text-primary">
                {formatMoney(discretionarySpent)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-secondary">Overspent days</Text>
              <Text className="text-sm font-semibold text-primary">
                {overspentDays}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-secondary">Budget mode</Text>
              <Text className="text-sm font-semibold text-primary">
                {rolloverUnspent ? "Rollover" : "Fixed"}
              </Text>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}
