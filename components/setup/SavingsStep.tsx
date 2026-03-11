import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { formatCurrency } from "@/lib/format";
import { COLORS } from "@/constants/theme";

type SavingsStepProps = {
  savingsMode: "percent" | "fixed";
  onSetSavingsMode: (mode: "percent" | "fixed") => void;
  savingsValue: string;
  onSavingsValueChange: (value: string) => void;
  savingsAmount: number;
  onSetNone: () => void;
};

export function SavingsStep({
  savingsMode,
  onSetSavingsMode,
  savingsValue,
  onSavingsValueChange,
  savingsAmount,
  onSetNone,
}: SavingsStepProps) {
  return (
    <View className="gap-5">
      <View>
        <Text className="text-primary text-2xl font-bold">Savings target</Text>
        <Text className="text-secondary mt-1">
          Pick a percent or fixed amount.
        </Text>
      </View>

      <View className="flex-row bg-borderAlt p-1 rounded-lg border border-border">
        <Pressable
          onPress={() => onSetSavingsMode("percent")}
          className={`flex-1 py-2 rounded-md items-center ${
            savingsMode === "percent" ? "bg-accent" : ""
          }`}
        >
          <Text
            className={
              savingsMode === "percent" ? "text-white font-semibold" : "text-secondary"
            }
          >
            Percent
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onSetSavingsMode("fixed")}
          className={`flex-1 py-2 rounded-md items-center ${
            savingsMode === "fixed" ? "bg-accent" : ""
          }`}
        >
          <Text
            className={
              savingsMode === "fixed" ? "text-white font-semibold" : "text-secondary"
            }
          >
            Fixed
          </Text>
        </Pressable>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-secondary">
          {savingsMode === "percent" ? "Savings percent" : "Savings amount"}
        </Text>
        <View className="flex-row items-center bg-borderAlt border border-border rounded-xl px-4">
          <Text className="text-primary mr-2">
            {savingsMode === "percent" ? "%" : "$"}
          </Text>
          <TextInput
            keyboardType="decimal-pad"
            value={savingsValue}
            onChangeText={onSavingsValueChange}
            placeholder={savingsMode === "percent" ? "20" : "500"}
            placeholderTextColor={COLORS.textSecondary}
            className="flex-1 text-primary py-4 text-lg"
          />
        </View>
        {savingsMode === "percent" && (
          <Text className="text-xs text-secondary">
            Percent is capped between 0 and 100.
          </Text>
        )}
      </View>

      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onSetNone}
          className="px-3 py-2 rounded-full border border-border bg-borderAlt"
        >
          <Text className="text-xs text-primary">None (0)</Text>
        </Pressable>
        <Text className="text-secondary text-sm">
          Estimated savings:{" "}
          <Text className="text-success font-semibold">
            {formatCurrency(savingsAmount)}
          </Text>
        </Text>
      </View>
    </View>
  );
}
