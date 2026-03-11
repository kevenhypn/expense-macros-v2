import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Transaction, ExpandedCard, FilterType, isSpendingCategory, SPENDING_CATEGORIES } from "@/types";
import { BudgetCalculation, getFilteredDayTransactions } from "@/lib/calculations";
import { isSameMonth } from "@/lib/dates";
import { PeriodCard } from "./PeriodCard";
import { TodayCard } from "./TodayCard";
import { TransactionList } from "./TransactionList";
import { FilterBar } from "./FilterBar";

type DayViewProps = {
  budget: BudgetCalculation;
  config: { rolloverUnspent?: boolean; monthlyIncome: number };
  transactions: Transaction[];
  selectedDateISO: string;
  expandedCard: ExpandedCard;
  onToggleCard: (card: "period" | "today") => void;
  onOpenAdd: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
};

export function DayView({
  budget,
  config,
  transactions,
  selectedDateISO,
  expandedCard,
  onToggleCard,
  onOpenAdd,
  onEdit,
  onDelete,
  filter,
  onFilterChange,
}: DayViewProps) {
  const rolloverUnspent = config.rolloverUnspent ?? false;

  // Get day's transactions
  const dayTxs = transactions.filter((t) => t.date === selectedDateISO);
  const filteredList = getFilteredDayTransactions(dayTxs, filter);

  // Today's spending transactions for the expanded card
  const todaySpendingTxs = dayTxs.filter((t) =>
    SPENDING_CATEGORIES.includes(t.category as typeof SPENDING_CATEGORIES[number])
  );

  return (
    <>
      {/* Summary Cards */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(100)}
        className="px-6 flex-col gap-4 mb-6"
      >
        <PeriodCard
          periodLeft={budget.periodLeft}
          availableToSpend={budget.availableToSpend}
          discretionarySpent={budget.discretionarySpent}
          overspentDays={budget.overspentDays}
          rolloverUnspent={rolloverUnspent}
          daysLeftInMonth={budget.daysLeftInMonth}
          selectedDateISO={selectedDateISO}
          isExpanded={expandedCard === "period"}
          onToggle={() => onToggleCard("period")}
        />

        <TodayCard
          remainingToday={budget.todayLeft}
          safeToSpendToday={budget.dailyBudget}
          todayNet={budget.todayNet}
          todayReimbursed={budget.todayReimbursed}
          rolloverUnspent={rolloverUnspent}
          todaySpending={budget.todaySpending}
          todaySpendingTxs={todaySpendingTxs}
          monthlyIncome={config.monthlyIncome}
          isExpanded={expandedCard === "today"}
          onToggle={() => onToggleCard("today")}
        />
      </Animated.View>

      {/* Add Transaction Button */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(200)}
        className="px-6 mb-8"
      >
        <Pressable
          onPress={onOpenAdd}
          className="w-full rounded-3xl border border-border bg-card p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <View className="w-1 h-12 rounded-full bg-accent/80" />
            <View className="gap-1">
              <Text className="text-primary font-semibold text-base">
                Add transaction
              </Text>
              <Text className="text-xs text-secondary">
                Tap to enter amount and details
              </Text>
            </View>
          </View>
          <View className="h-10 px-4 rounded-full bg-accent/15 items-center justify-center border border-accent/30">
            <Text className="text-accent font-semibold">Amount</Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* Filter Bar */}
      <View className="px-6">
        <FilterBar
          activeFilter={filter as FilterType}
          onFilterChange={onFilterChange as (f: FilterType) => void}
        />
      </View>

      {/* Transaction Log */}
      <TransactionList
        transactions={filteredList}
        selectedDateISO={selectedDateISO}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
