import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { formatMoney } from "@/lib/format";
import { Transaction, SPENDING_CATEGORIES, SpendingCategory, isSpendingCategory } from "@/types";
import { SpendingTotals } from "@/lib/calculations";
import { CATEGORY_CONFIG } from "@/constants/categories";
import { ProgressBar } from "@/components/ui/ProgressBar";

type TodayCardProps = {
  remainingToday: number;
  safeToSpendToday: number;
  todayNet: number;
  todayReimbursed: number;
  rolloverUnspent: boolean;
  todaySpending: SpendingTotals;
  todaySpendingTxs: Transaction[];
  monthlyIncome: number;
  isExpanded: boolean;
  onToggle: () => void;
};

export function TodayCard({
  remainingToday,
  safeToSpendToday,
  todayNet,
  todayReimbursed,
  rolloverUnspent,
  todaySpending,
  todaySpendingTxs,
  monthlyIncome,
  isExpanded,
  onToggle,
}: TodayCardProps) {
  const isPositive = remainingToday >= 0;

  return (
    <Pressable onPress={onToggle}>
      <Animated.View
        layout={LinearTransition.duration(200)}
        className="bg-card border border-border rounded-3xl p-5 gap-2"
      >
        <Text className="text-secondary text-sm uppercase tracking-wider font-semibold">
          Safe to spend today
        </Text>
        <View className="flex-row justify-between items-baseline">
          <Text
            className={`text-3xl font-bold ${
              isPositive ? "text-success" : "text-danger"
            }`}
          >
            {formatMoney(remainingToday)}
          </Text>
          <Text className="text-secondary text-sm font-medium">
            {formatMoney(safeToSpendToday)} safe {"  "}
            {rolloverUnspent ? "rollover" : "fixed"}
          </Text>
        </View>
        <Text className="text-xs text-secondary mt-1">
          Updates as you spend
        </Text>

        {isExpanded && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            className="mt-4 pt-4 border-t border-border gap-3"
          >
            <Text className="text-xs text-secondary uppercase tracking-wider font-semibold">
              Today&apos;s guide
            </Text>
            <View className="flex-row gap-2">
              <View className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                <Text className="text-xs text-secondary">
                  Net today: {formatMoney(todayNet)}
                </Text>
              </View>
              <View className="px-3 py-1 rounded-full bg-success/10 border border-success/20">
                <Text className="text-xs text-success">
                  Reimbursed: {formatMoney(todayReimbursed)}
                </Text>
              </View>
            </View>

            <Text className="text-xs text-secondary uppercase tracking-wider font-semibold mt-1">
              Today&apos;s spending
            </Text>

            {todaySpending.totalSpent === 0 ? (
              <Text className="text-xs text-secondary/60 mb-2">
                No spending yet today.
              </Text>
            ) : (
              <View className="gap-4 mb-2">
                {SPENDING_CATEGORIES.map((cat) => {
                  const spent = todaySpending.totals[cat];
                  if (spent <= 0) return null;
                  const pctSpent = todaySpending.totalSpent
                    ? (spent / todaySpending.totalSpent) * 100
                    : 0;
                  const pctIncome = monthlyIncome
                    ? (spent / monthlyIncome) * 100
                    : 0;
                  return (
                    <View key={cat} className="gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-primary">{cat}</Text>
                        <Text className="text-xs text-secondary">
                          {pctSpent.toFixed(0)}% spent {"  "}
                          {pctIncome.toFixed(0)}% income
                        </Text>
                      </View>
                      <ProgressBar
                        progress={pctSpent}
                        color={CATEGORY_CONFIG[cat].color}
                        height={6}
                      />
                    </View>
                  );
                })}
              </View>
            )}

            <View className="gap-3">
              {todaySpendingTxs.map((tx) => (
                <View
                  key={tx.id}
                  className={`flex-row justify-between items-center gap-3 ${
                    tx.isSystem ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <View className="flex-row gap-3 items-center flex-1">
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: CATEGORY_CONFIG[tx.category].bgBadge,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "700",
                          color: CATEGORY_CONFIG[tx.category].textBadge,
                        }}
                      >
                        {tx.category[0]}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-primary">
                        {tx.category}
                      </Text>
                      <Text className="text-xs text-secondary">
                        {tx.note ? `${tx.note} \u2022 ${tx.date}` : tx.date}
                      </Text>
                    </View>
                  </View>
                  <Text className="font-bold text-primary">
                    {tx.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
              {todaySpendingTxs.length === 0 && (
                <Text className="text-center text-secondary/60 mt-2">
                  No transactions found
                </Text>
              )}
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}
