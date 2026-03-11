import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Transaction, SPENDING_CATEGORIES, EXPENSE_CATEGORIES } from "@/types";
import { BudgetCalculation, getPeriodLogTransactions } from "@/lib/calculations";
import { formatMoney } from "@/lib/format";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { TransactionRow } from "./TransactionRow";

type MonthViewProps = {
  budget: BudgetCalculation;
  transactions: Transaction[];
  selectedDateISO: string;
  rolloverUnspent: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
};

export function MonthView({
  budget,
  transactions,
  selectedDateISO,
  rolloverUnspent,
  onEdit,
  onDelete,
}: MonthViewProps) {
  const periodLogTxs = getPeriodLogTransactions(transactions, selectedDateISO);

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(100)}
      className="px-6 flex-col gap-4"
    >
      {/* Month summary */}
      <View className="bg-card border border-border rounded-3xl p-5 gap-3">
        <Text className="text-secondary text-sm uppercase tracking-wider font-semibold">
          Month breakdown
        </Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs text-secondary">Left</Text>
            <Text
              className={`text-2xl font-bold ${
                budget.periodLeft >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {formatMoney(budget.periodLeft)}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-secondary">Overspent days</Text>
            <Text className="text-2xl font-bold text-primary">
              {budget.overspentDays}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs text-secondary">Spent</Text>
            <Text className="text-lg font-semibold text-primary">
              {formatMoney(budget.discretionarySpent)}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-secondary">Budget mode</Text>
            <Text className="text-lg font-semibold text-primary">
              {rolloverUnspent ? "Rollover" : "Fixed"}
            </Text>
          </View>
        </View>
      </View>

      {/* Full category breakdown (% of income) */}
      <CategoryBreakdown
        title="Full category breakdown"
        categories={[...EXPENSE_CATEGORIES]}
        totals={budget.fullExpenses.totals}
        totalSpent={budget.fullExpenses.totalSpent}
        mode="pctOfIncome"
        totalIncome={budget.totalIncome}
      />

      {/* Discretionary category breakdown (% of spending) */}
      <CategoryBreakdown
        title="Category breakdown"
        categories={[...SPENDING_CATEGORIES]}
        totals={budget.periodSpending.totals}
        totalSpent={budget.periodSpending.totalSpent}
        mode="pctOfSpent"
      />

      {/* Month log */}
      <View className="bg-cardAlt rounded-3xl p-5 gap-3">
        <Text className="text-xs text-secondary uppercase tracking-wider font-semibold">
          Month log
        </Text>
        {periodLogTxs.map((tx) => (
          <TransactionRow
            key={tx.id}
            tx={tx}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={false}
          />
        ))}
        {periodLogTxs.length === 0 && (
          <Text className="text-center text-secondary/60 mt-2">
            No transactions found
          </Text>
        )}
      </View>
    </Animated.View>
  );
}
