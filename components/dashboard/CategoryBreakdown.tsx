import React from "react";
import { View, Text } from "react-native";
import { CATEGORY_CONFIG } from "@/constants/categories";
import { ProgressBar } from "@/components/ui/ProgressBar";

type CategoryBreakdownProps = {
  title: string;
  categories: readonly string[];
  totals: Record<string, number>;
  totalSpent: number;
  mode: "pctOfSpent" | "pctOfIncome";
  totalIncome?: number;
};

export function CategoryBreakdown({
  title,
  categories,
  totals,
  totalSpent,
  mode,
  totalIncome = 0,
}: CategoryBreakdownProps) {
  const hasData = totalSpent > 0;

  return (
    <View className="bg-card border border-border rounded-3xl p-5 gap-3">
      <Text className="text-xs text-secondary uppercase tracking-wider font-semibold">
        {title}
      </Text>
      {!hasData ? (
        <Text className="text-xs text-secondary/60">
          No expenses yet for this period.
        </Text>
      ) : (
        <View className="gap-4">
          {categories.map((cat) => {
            const spent = totals[cat] ?? 0;
            if (spent <= 0) return null;

            const pct =
              mode === "pctOfIncome"
                ? totalIncome > 0
                  ? (spent / totalIncome) * 100
                  : 0
                : totalSpent > 0
                  ? (spent / totalSpent) * 100
                  : 0;

            const config =
              CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG];

            return (
              <View key={cat} className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-primary">{cat}</Text>
                  <Text className="text-xs text-secondary">
                    {pct.toFixed(0)}% {"\u2022"} ${spent.toFixed(0)}
                  </Text>
                </View>
                <ProgressBar
                  progress={pct}
                  color={config?.color ?? "#6B7280"}
                  height={6}
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
