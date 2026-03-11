import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { BottomModal } from "@/components/ui/Modal";
import { AmountInput } from "@/components/ui/AmountInput";
import { CategoryGrid } from "@/components/ui/CategoryGrid";
import {
  TransactionCategory,
  REIMBURSEMENT_CATEGORIES,
  isSpendingCategory,
} from "@/types";
import { COLORS } from "@/constants/theme";

type AddTransactionModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (
    amount: number,
    isIncome: boolean,
    category: TransactionCategory,
    note: string
  ) => void;
};

export function AddTransactionModal({
  visible,
  onClose,
  onAdd,
}: AddTransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [isIncome, setIsIncome] = useState(false);
  const [selectedCat, setSelectedCat] = useState<TransactionCategory>("Food");
  const [note, setNote] = useState("");

  // Reset income category restriction
  useEffect(() => {
    if (isIncome && !isSpendingCategory(selectedCat)) {
      setSelectedCat("Other");
    }
  }, [isIncome, selectedCat]);

  const handleAdd = () => {
    const val = parseFloat(amount);
    if (!val || isNaN(val)) return;
    onAdd(val, isIncome, selectedCat, note);
    setAmount("");
    setNote("");
    setIsIncome(false);
    setSelectedCat("Food");
    onClose();
  };

  return (
    <BottomModal visible={visible} onClose={onClose} title="New transaction">
      <AmountInput
        amount={amount}
        setAmount={setAmount}
        isIncome={isIncome}
        setIsIncome={setIsIncome}
      />
      <CategoryGrid
        selected={selectedCat}
        onSelect={setSelectedCat}
        allowedCategories={isIncome ? REIMBURSEMENT_CATEGORIES : undefined}
      />
      <TextInput
        placeholder="Note (optional)"
        placeholderTextColor={COLORS.textSecondary}
        value={note}
        onChangeText={setNote}
        className="w-full border-b border-border pb-2 text-secondary"
      />
      <Pressable
        onPress={handleAdd}
        className={`w-full py-4 rounded-2xl shadow-lg items-center ${
          isIncome ? "bg-success" : "bg-danger"
        }`}
      >
        <Text className="text-white font-bold text-base">Add Transaction</Text>
      </Pressable>
    </BottomModal>
  );
}
