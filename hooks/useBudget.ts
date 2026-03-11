import { useMemo } from "react";
import { BudgetConfig, Transaction } from "@/types";
import { calculateBudget, BudgetCalculation } from "@/lib/calculations";

export function useBudget(
  config: BudgetConfig | null,
  transactions: Transaction[],
  selectedDateISO: string
): BudgetCalculation | null {
  return useMemo(() => {
    if (!config) return null;
    return calculateBudget(config, transactions, selectedDateISO);
  }, [config, transactions, selectedDateISO]);
}
