import {
  BudgetConfig,
  Transaction,
  SpendingCategory,
  ExpenseCategory,
  SPENDING_CATEGORIES,
  EXPENSE_CATEGORIES,
  isSpendingCategory,
} from "@/types";
import { daysInMonth, getMonthPrefix, buildDateISO, getDayOfMonth, isSameMonth } from "./dates";

export type Financials = {
  billsTotal: number;
  savingsAmount: number;
  availableToSpend: number;
};

export function calculateFinancials(config: BudgetConfig): Financials {
  const billsTotal = config.bills.reduce((sum, b) => sum + b.amount, 0);

  let savingsAmount = 0;
  if (config.savingsGoal.mode === "percent") {
    savingsAmount = config.monthlyIncome * (config.savingsGoal.percent / 100);
  } else {
    savingsAmount = config.savingsGoal.amount;
  }

  const availableToSpend = config.monthlyIncome - billsTotal - savingsAmount;

  return { billsTotal, savingsAmount, availableToSpend };
}

export type SpendingTotals = {
  totals: Record<SpendingCategory, number>;
  totalSpent: number;
};

export function buildSpendingTotals(txs: Transaction[]): SpendingTotals {
  const netTotals: Record<SpendingCategory, number> = {
    Food: 0,
    Shopping: 0,
    Transport: 0,
    Entertainment: 0,
    Other: 0,
  };

  txs.forEach((t) => {
    if (!SPENDING_CATEGORIES.includes(t.category as SpendingCategory)) return;
    netTotals[t.category as SpendingCategory] += t.amount;
  });

  const totals = SPENDING_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = Math.max(0, -netTotals[cat]);
      return acc;
    },
    {} as Record<SpendingCategory, number>
  );

  const totalSpent = Object.values(totals).reduce((sum, val) => sum + val, 0);
  return { totals, totalSpent };
}

export type ExpenseTotals = {
  totals: Record<ExpenseCategory, number>;
  totalSpent: number;
};

export function buildExpenseTotals(txs: Transaction[]): ExpenseTotals {
  const netTotals: Record<ExpenseCategory, number> = {
    Bills: 0,
    Savings: 0,
    Food: 0,
    Shopping: 0,
    Transport: 0,
    Entertainment: 0,
    Other: 0,
  };

  txs.forEach((t) => {
    if (!EXPENSE_CATEGORIES.includes(t.category as ExpenseCategory)) return;
    netTotals[t.category as ExpenseCategory] += t.amount;
  });

  const totals = EXPENSE_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = Math.max(0, -netTotals[cat]);
      return acc;
    },
    {} as Record<ExpenseCategory, number>
  );

  const totalSpent = Object.values(totals).reduce((sum, val) => sum + val, 0);
  return { totals, totalSpent };
}

export type BudgetCalculation = {
  baseAvailableToSpend: number;
  availableToSpend: number;
  periodLeft: number;
  discretionarySpent: number;
  totalIncome: number;
  dailyBudget: number;
  overspentDays: number;
  todayNet: number;
  todaySpent: number;
  todayReimbursed: number;
  todayLeft: number;
  daysLeftInMonth: number;
  periodSpending: SpendingTotals;
  todaySpending: SpendingTotals;
  fullExpenses: ExpenseTotals;
};

export function calculateBudget(
  config: BudgetConfig,
  transactions: Transaction[],
  selectedDateISO: string
): BudgetCalculation {
  const rolloverUnspent = config.rolloverUnspent ?? false;
  const { availableToSpend: baseAvailableToSpend } = calculateFinancials(config);

  // Filter for current month
  const currentMonthTxs = transactions.filter((t) =>
    isSameMonth(t.date, selectedDateISO)
  );

  // Discretionary calculation
  const netDiscretionary = currentMonthTxs.reduce((sum, t) => {
    if (!isSpendingCategory(t.category)) return sum;
    return sum + t.amount;
  }, 0);
  const discretionarySpent = Math.max(0, -netDiscretionary);

  const totalIncome = currentMonthTxs.reduce((sum, t) => {
    if (t.category !== "Income") return sum;
    if (t.amount <= 0) return sum;
    return sum + t.amount;
  }, 0);

  // User-added income adjustments (non-system income transactions)
  const incomeAdjustments = currentMonthTxs.reduce((sum, t) => {
    if (t.isSystem) return sum;
    if (t.category !== "Income") return sum;
    if (t.amount <= 0) return sum;
    return sum + t.amount;
  }, 0);

  const availableToSpend = baseAvailableToSpend + incomeAdjustments;
  const periodLeft = availableToSpend + netDiscretionary;

  // Today's Budget Logic
  const dim = daysInMonth(selectedDateISO);
  const baseDailyBudget = availableToSpend / dim;
  const monthPrefix = getMonthPrefix(selectedDateISO);
  const selectedDay = getDayOfMonth(selectedDateISO);

  const selectedDayTxs = currentMonthTxs.filter(
    (t) => t.date === selectedDateISO
  );

  // Build net spending by date for rollover calculation
  const netSpendingByDate = currentMonthTxs.reduce(
    (acc, t) => {
      if (!isSpendingCategory(t.category)) return acc;
      acc[t.date] = (acc[t.date] ?? 0) + t.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  let dailyBudget = baseDailyBudget;
  let overspentDays = 0;

  if (rolloverUnspent) {
    let remainingBudget = availableToSpend;
    for (let day = 1; day <= dim; day += 1) {
      const remainingDays = dim - day + 1;
      const dayBudget = remainingBudget / remainingDays;
      const dateISO = buildDateISO(monthPrefix, day);
      const spent = -(netSpendingByDate[dateISO] ?? 0);
      if (spent > dayBudget) overspentDays += 1;
      if (day === selectedDay) dailyBudget = dayBudget;
      remainingBudget -= spent;
    }
  } else {
    for (let day = 1; day <= dim; day += 1) {
      const dateISO = buildDateISO(monthPrefix, day);
      const spent = -(netSpendingByDate[dateISO] ?? 0);
      if (spent > baseDailyBudget) overspentDays += 1;
    }
  }

  // Today calculations
  const todayNet = selectedDayTxs.reduce((sum, t) => {
    if (!isSpendingCategory(t.category)) return sum;
    return sum + t.amount;
  }, 0);
  const todaySpent = -todayNet;
  const todayReimbursed = selectedDayTxs.reduce((sum, t) => {
    if (!isSpendingCategory(t.category)) return sum;
    if (t.amount <= 0) return sum;
    return sum + t.amount;
  }, 0);
  const todayLeft = dailyBudget - todaySpent;
  const daysLeftInMonth = dim - selectedDay + 1;

  // Build breakdowns
  const periodSpending = buildSpendingTotals(currentMonthTxs);
  const todaySpending = buildSpendingTotals(selectedDayTxs);
  const fullExpenses = buildExpenseTotals(currentMonthTxs);

  return {
    baseAvailableToSpend,
    availableToSpend,
    periodLeft,
    discretionarySpent,
    totalIncome,
    dailyBudget,
    overspentDays,
    todayNet,
    todaySpent,
    todayReimbursed,
    todayLeft,
    daysLeftInMonth,
    periodSpending,
    todaySpending,
    fullExpenses,
  };
}

/**
 * Get filtered and sorted transactions for the day view.
 */
export function getFilteredDayTransactions(
  dayTxs: Transaction[],
  filter: string
): Transaction[] {
  return dayTxs
    .filter((t) => {
      if (filter === "All") return true;
      if (filter === "Spending")
        return !["Bills", "Savings", "Income"].includes(t.category);
      return t.category === filter;
    })
    .sort((a, b) => {
      // User transactions first, system transactions last
      if (a.isSystem && !b.isSystem) return 1;
      if (!a.isSystem && b.isSystem) return -1;

      if (!a.isSystem && !b.isSystem) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      // System transactions: Bills, Savings, Income order
      const systemOrder: Record<string, number> = {
        Bills: 0,
        Savings: 1,
        Income: 2,
      };
      const orderDiff =
        (systemOrder[a.category] ?? 99) - (systemOrder[b.category] ?? 99);
      if (orderDiff !== 0) return orderDiff;

      // Bills sorted by amount ascending
      if (a.category === "Bills" && b.category === "Bills") {
        return Math.abs(a.amount) - Math.abs(b.amount);
      }

      return 0;
    });
}

/**
 * Get transactions for period (month) log sorted by date descending.
 */
export function getPeriodLogTransactions(
  transactions: Transaction[],
  selectedDateISO: string
): Transaction[] {
  return transactions
    .filter((t) => isSameMonth(t.date, selectedDateISO))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Compute percentage of income.
 */
export function pctOfIncome(amount: number, totalIncome: number): number {
  return totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
}
