export type TransactionCategory =
  | "Food"
  | "Bills"
  | "Savings"
  | "Shopping"
  | "Transport"
  | "Entertainment"
  | "Other"
  | "Income";

export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // IN positive, OUT negative
  category: TransactionCategory;
  note?: string;
  isSystem?: boolean;
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
};

export type SavingsGoal =
  | { mode: "percent"; percent: number }
  | { mode: "fixed"; amount: number };

export type BudgetConfig = {
  startDate: string; // YYYY-MM-DD
  monthlyIncome: number;
  bills: Bill[];
  savingsGoal: SavingsGoal;
  rolloverUnspent?: boolean;
};

export type FilterType = "All" | "Spending" | "Bills" | "Savings" | "Income";

export type ViewMode = "day" | "period";

export type ExpandedCard = "period" | "today" | null;

export const SPENDING_CATEGORIES = [
  "Food",
  "Shopping",
  "Transport",
  "Entertainment",
  "Other",
] as const;
export type SpendingCategory = (typeof SPENDING_CATEGORIES)[number];

export const EXPENSE_CATEGORIES = [
  "Bills",
  "Savings",
  "Food",
  "Shopping",
  "Transport",
  "Entertainment",
  "Other",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const ALL_CATEGORIES: TransactionCategory[] = [
  "Food",
  "Bills",
  "Savings",
  "Shopping",
  "Transport",
  "Entertainment",
  "Income",
  "Other",
];

export const REIMBURSEMENT_CATEGORIES: TransactionCategory[] = [
  "Food",
  "Shopping",
  "Transport",
  "Entertainment",
  "Other",
];

export function isSpendingCategory(
  category: TransactionCategory
): category is SpendingCategory {
  return !["Bills", "Savings", "Income"].includes(category);
}
