import React from "react";
import { View, Text } from "react-native";
import { Bill } from "@/types";
import { formatCurrency } from "@/lib/format";

type ReviewStepProps = {
  startDate: string;
  rolloverUnspent: boolean;
  billCount: number;
  dailyBudget: number;
};

export function ReviewStep({
  startDate,
  rolloverUnspent,
  billCount,
  dailyBudget,
}: ReviewStepProps) {
  return (
    <View className="gap-5">
      <View>
        <Text className="text-primary text-2xl font-bold">
          Review your setup
        </Text>
        <Text className="text-secondary mt-1">
          You can update any of this later.
        </Text>
      </View>

      <View className="bg-card border border-border rounded-2xl p-4 gap-3">
        <View className="flex-row justify-between">
          <Text className="text-secondary">Month starts</Text>
          <Text className="text-primary font-medium">{startDate}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-secondary">Rollover</Text>
          <Text className="text-primary font-medium">
            {rolloverUnspent ? "On" : "Off"}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-secondary">Active bills</Text>
          <Text className="text-primary font-medium">{billCount}</Text>
        </View>
      </View>

      <View className="bg-accent/10 border border-accent/30 rounded-2xl p-4">
        <Text className="text-accent text-xs uppercase tracking-wider font-semibold">
          Daily budget
        </Text>
        <Text className="text-primary text-3xl font-bold mt-1">
          {formatCurrency(dailyBudget)}
        </Text>
      </View>
    </View>
  );
}
