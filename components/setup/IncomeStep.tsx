import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { CalendarDays } from "lucide-react-native";
import { formatDateLong } from "@/lib/dates";
import { COLORS } from "@/constants/theme";

type IncomeStepProps = {
  monthlyIncome: string;
  onIncomeChange: (value: string) => void;
  incomeError?: string;
  startDate: string;
  onOpenDatePicker: () => void;
  rolloverUnspent: boolean;
  onToggleRollover: () => void;
};

export function IncomeStep({
  monthlyIncome,
  onIncomeChange,
  incomeError,
  startDate,
  onOpenDatePicker,
  rolloverUnspent,
  onToggleRollover,
}: IncomeStepProps) {
  return (
    <View className="gap-5">
      <View>
        <Text className="text-primary text-2xl font-bold">
          Set up your budget
        </Text>
        <Text className="text-secondary mt-1">
          A quick setup to start tracking today.
        </Text>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-secondary">Monthly income</Text>
        <View className="flex-row items-center bg-borderAlt border border-border rounded-xl px-4">
          <Text className="text-primary text-xl mr-2">$</Text>
          <TextInput
            keyboardType="decimal-pad"
            value={monthlyIncome}
            onChangeText={onIncomeChange}
            placeholder="5000"
            placeholderTextColor={COLORS.textSecondary}
            className="flex-1 text-primary text-xl py-4"
          />
        </View>
        {!!incomeError && (
          <Text className="text-danger text-xs">{incomeError}</Text>
        )}
      </View>

      <View className="gap-2">
        <Text className="text-sm text-secondary">Month start date</Text>
        <Pressable
          onPress={onOpenDatePicker}
          className="bg-borderAlt border border-border rounded-xl px-4 py-4 flex-row items-center justify-between"
        >
          <Text className="text-primary text-base">
            {formatDateLong(startDate)}
          </Text>
          <CalendarDays size={18} color={COLORS.textSecondary} />
        </Pressable>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-secondary">
          Rollover unspent budget
        </Text>
        <Pressable
          onPress={onToggleRollover}
          className="w-full bg-borderAlt p-4 rounded-xl border border-border flex-row items-center justify-between"
        >
          <Text className="text-secondary flex-1 mr-3">
            Unused daily allowance carries into remaining days.
          </Text>
          <View
            className={`w-12 h-7 rounded-full p-1 ${
              rolloverUnspent ? "bg-accent" : "bg-borderAlt"
            }`}
            style={{
              borderWidth: rolloverUnspent ? 0 : 1,
              borderColor: COLORS.border,
            }}
          >
            <View
              className={`w-5 h-5 rounded-full bg-white ${
                rolloverUnspent ? "ml-5" : "ml-0"
              }`}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
