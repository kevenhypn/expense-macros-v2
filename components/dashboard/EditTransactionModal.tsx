import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { BottomModal } from "@/components/ui/Modal";
import { CategoryGrid } from "@/components/ui/CategoryGrid";
import { Transaction, TransactionCategory } from "@/types";
import { COLORS } from "@/constants/theme";

type EditTransactionModalProps = {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (
    id: string,
    date: string,
    amount: number,
    category: TransactionCategory,
    note: string
  ) => void;
};

export function EditTransactionModal({
  transaction,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const [editDate, setEditDate] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editCategory, setEditCategory] =
    useState<TransactionCategory>("Food");

  useEffect(() => {
    if (transaction) {
      setEditDate(transaction.date);
      setEditAmount(String(Math.abs(transaction.amount)));
      setEditNote(transaction.note ?? "");
      setEditCategory(transaction.category);
    }
  }, [transaction]);

  const handleSave = () => {
    if (!transaction) return;
    const parsedAmount = parseFloat(editAmount);
    if (!editDate || isNaN(parsedAmount)) return;
    onSave(transaction.id, editDate, parsedAmount, editCategory, editNote);
    onClose();
  };

  return (
    <BottomModal
      visible={!!transaction}
      onClose={onClose}
      title="Edit transaction"
    >
      <View className="flex-row gap-3">
        <TextInput
          value={editDate}
          onChangeText={setEditDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.textSecondary}
          className="flex-1 bg-borderAlt p-3 rounded-xl text-primary border border-border"
        />
        <TextInput
          keyboardType="decimal-pad"
          value={editAmount}
          onChangeText={setEditAmount}
          placeholder="$"
          placeholderTextColor={COLORS.textSecondary}
          className="w-28 bg-borderAlt p-3 rounded-xl text-primary border border-border"
        />
      </View>
      <CategoryGrid selected={editCategory} onSelect={setEditCategory} />
      <TextInput
        placeholder="Note (optional)"
        placeholderTextColor={COLORS.textSecondary}
        value={editNote}
        onChangeText={setEditNote}
        className="w-full border-b border-border pb-2 text-secondary"
      />
      <View className="flex-row gap-2">
        <Pressable
          onPress={handleSave}
          className="flex-1 bg-success p-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Save</Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          className="flex-1 bg-borderAlt p-3 rounded-xl items-center"
        >
          <Text className="text-secondary font-semibold">Cancel</Text>
        </Pressable>
      </View>
    </BottomModal>
  );
}
