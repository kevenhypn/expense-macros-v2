import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import {
  Transaction,
  TransactionCategory,
  isSpendingCategory,
} from "@/types";
import { saveTransactions, generateId } from "@/lib/storage";

type UseTransactionsParams = {
  transactions: Transaction[];
  setTransactions: (txs: Transaction[]) => void;
  selectedDateISO: string;
};

export function useTransactions({
  transactions,
  setTransactions,
  selectedDateISO,
}: UseTransactionsParams) {
  const addTransaction = useCallback(
    async (
      amount: number,
      isIncome: boolean,
      category: TransactionCategory,
      note: string
    ) => {
      const safeCategory =
        isIncome && !isSpendingCategory(category) ? "Other" : category;

      const newTx: Transaction = {
        id: generateId(),
        date: selectedDateISO,
        amount: isIncome ? Math.abs(amount) : -Math.abs(amount),
        category: safeCategory,
        note: note || undefined,
        isSystem: false,
      };

      const newTxs = [newTx, ...transactions];
      setTransactions(newTxs);
      await saveTransactions(newTxs);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [transactions, setTransactions, selectedDateISO]
  );

  const editTransaction = useCallback(
    async (
      id: string,
      date: string,
      amount: number,
      category: TransactionCategory,
      note: string
    ) => {
      const nextTxs = transactions.map((tx) => {
        if (tx.id !== id) return tx;
        // Preserve original sign (income stays income, expense stays expense)
        const signedAmount =
          tx.amount >= 0 ? Math.abs(amount) : -Math.abs(amount);
        return {
          ...tx,
          date,
          amount: signedAmount,
          note: note || undefined,
          category,
        };
      });

      setTransactions(nextTxs);
      await saveTransactions(nextTxs);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [transactions, setTransactions]
  );

  return { addTransaction, editTransaction };
}
