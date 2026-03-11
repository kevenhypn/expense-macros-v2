import React from "react";
import { Text, View } from "react-native";
import { calculateFinancials } from "@/lib/calculations";
import { daysInMonth } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import { Bill, BudgetConfig, SavingsGoal } from "@/types";

type BudgetPreviewProps = {
  monthlyIncome: number;
  startDate: string;
  bills: Bill[];
  savingsGoal: SavingsGoal;
};

export function BudgetPreview({
  monthlyIncome,
  startDate,
  bills,
  savingsGoal,
}: BudgetPreviewProps) {
  const previewConfig: BudgetConfig = {
    startDate,
    monthlyIncome,
    bills,
    savingsGoal,
    rolloverUnspent: false,
  };

  const { billsTotal, savingsAmount, availableToSpend } =
    calculateFinancials(previewConfig);
  const monthDays = daysInMonth(startDate);
  const dailyBudget = monthDays > 0 ? availableToSpend / monthDays : 0;

  return (
    <View className="bg-card border border-border rounded-2xl p-4 gap-3">
      <Text className="text-xs text-secondary uppercase tracking-wider font-semibold">
        Budget preview
      </Text>

      <View className="flex-row justify-between">
        <Text className="text-secondary">Monthly income</Text>
        <Text className="text-success font-semibold">
          {formatCurrency(monthlyIncome)}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-secondary">Bills total</Text>
        <Text className="text-primary font-semibold">
          {formatCurrency(billsTotal)}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-secondary">Savings</Text>
        <Text className="text-primary font-semibold">
          {formatCurrency(savingsAmount)}
        </Text>
      </View>

      <View className="h-px bg-border" />

      <View className="flex-row justify-between">
        <Text className="text-primary font-medium">Available to spend</Text>
        <Text className="text-success font-bold">
          {formatCurrency(availableToSpend)}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-secondary">Estimated daily budget</Text>
        <Text className="text-primary font-semibold">
          {formatCurrency(dailyBudget)}
        </Text>
      </View>
    </View>
  );
}
