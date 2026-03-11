import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Transaction } from "@/types";
import { TransactionRow } from "./TransactionRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateLabel } from "@/lib/dates";

type TransactionListProps = {
  transactions: Transaction[];
  selectedDateISO: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
};

export function TransactionList({
  transactions,
  selectedDateISO,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const dateLabel = formatDateLabel(selectedDateISO);

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(300)}
      className="bg-cardAlt rounded-t-3xl min-h-[400px] p-6"
    >
      <View className="flex-row items-end justify-between mb-6">
        <Text className="text-xs text-secondary uppercase tracking-wider font-semibold">
          {dateLabel} transactions
        </Text>
        <Text className="text-xs text-secondary/60">
          {transactions.length} total
        </Text>
      </View>

      <View className="gap-4">
        {transactions.map((tx) => (
          <TransactionRow
            key={tx.id}
            tx={tx}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {transactions.length === 0 && (
          <EmptyState
            title="No transactions found"
            subtitle="Tap Add to create your first transaction."
          />
        )}
      </View>
    </Animated.View>
  );
}
