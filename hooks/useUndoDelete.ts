import { useState, useRef, useEffect, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { Transaction } from "@/types";
import { saveTransactions } from "@/lib/storage";

type PendingDelete = {
  tx: Transaction;
  previousTxs: Transaction[];
  nextTxs: Transaction[];
};

type UseUndoDeleteParams = {
  transactions: Transaction[];
  setTransactions: (txs: Transaction[]) => void;
};

export function useUndoDelete({
  transactions,
  setTransactions,
}: UseUndoDeleteParams) {
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null
  );
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
        deleteTimerRef.current = null;
      }
    };
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const txToDelete = transactions.find((tx) => tx.id === id);
      if (!txToDelete) return;

      // Finalize any existing pending delete immediately
      if (deleteTimerRef.current && pendingDelete) {
        clearTimeout(deleteTimerRef.current);
        deleteTimerRef.current = null;
        await saveTransactions(pendingDelete.nextTxs);
        setPendingDelete(null);
      }

      const nextTxs = transactions.filter((tx) => tx.id !== id);
      setTransactions(nextTxs);
      setPendingDelete({ tx: txToDelete, previousTxs: transactions, nextTxs });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      deleteTimerRef.current = setTimeout(async () => {
        await saveTransactions(nextTxs);
        setPendingDelete(null);
        deleteTimerRef.current = null;
      }, 5000);
    },
    [transactions, setTransactions, pendingDelete]
  );

  const handleUndo = useCallback(async () => {
    if (!pendingDelete) return;
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    setTransactions(pendingDelete.previousTxs);
    await saveTransactions(pendingDelete.previousTxs);
    setPendingDelete(null);
  }, [pendingDelete, setTransactions]);

  return {
    pendingDelete,
    handleDelete,
    handleUndo,
  };
}
