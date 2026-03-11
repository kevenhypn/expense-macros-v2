import React from "react";
import { View, Text, Pressable } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import { Transaction } from "@/types";
import { CATEGORY_CONFIG } from "@/constants/categories";
import { COLORS } from "@/constants/theme";

type TransactionRowProps = {
  tx: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  showActions?: boolean;
};

export function TransactionRow({
  tx,
  onEdit,
  onDelete,
  showActions = true,
}: TransactionRowProps) {
  const config = CATEGORY_CONFIG[tx.category];

  return (
    <View
      className={`flex-row justify-between items-center gap-3 ${
        tx.isSystem ? "opacity-50" : "opacity-100"
      }`}
    >
      <View className="flex-row gap-3 items-center flex-1">
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: config.bgBadge,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: config.textBadge,
            }}
          >
            {tx.category[0]}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-medium text-primary">{tx.category}</Text>
          <Text className="text-xs text-secondary">
            {tx.note ? `${tx.note} \u2022 ${tx.date}` : tx.date}
            {tx.isSystem ? " (Auto)" : ""}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-3">
        <Text
          className={`font-bold ${
            tx.amount > 0 ? "text-success" : "text-primary"
          }`}
        >
          {tx.amount > 0 ? "+" : ""}
          {tx.amount.toFixed(2)}
        </Text>
        {showActions && (
          <>
            <Pressable onPress={() => onEdit(tx)} className="p-1" hitSlop={8}>
              <Pencil size={18} color={COLORS.textSecondary} />
            </Pressable>
            <Pressable
              onPress={() => onDelete(tx.id)}
              className="p-1"
              hitSlop={8}
            >
              <Trash2 size={18} color={COLORS.textSecondary} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
