import AsyncStorage from "@react-native-async-storage/async-storage";
import { BudgetConfig, Transaction } from "@/types";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { calculateFinancials } from "./calculations";

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export async function loadConfig(): Promise<BudgetConfig | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CONFIG);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Error loading config:", error);
    return null;
  }
}

export async function saveConfig(config: BudgetConfig): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving config:", error);
  }
}

export async function loadTransactions(): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error loading transactions:", error);
    return [];
  }
}

export async function saveTransactions(txs: Transaction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  } catch (error) {
    console.error("Error saving transactions:", error);
  }
}

export async function regenerateSystemTransactions(
  config: BudgetConfig
): Promise<void> {
  const existingTxs = await loadTransactions();
  const userTxs = existingTxs.filter((t) => !t.isSystem);

  const { savingsAmount } = calculateFinancials(config);
  const newSystemTxs: Transaction[] = [];
  const date = config.startDate;

  // Income
  newSystemTxs.push({
    id: generateId(),
    date,
    amount: config.monthlyIncome,
    category: "Income",
    isSystem: true,
    note: "Monthly Income",
  });

  // Bills
  config.bills.forEach((bill) => {
    newSystemTxs.push({
      id: generateId(),
      date,
      amount: -Math.abs(bill.amount),
      category: "Bills",
      isSystem: true,
      note: bill.name,
    });
  });

  // Savings
  if (savingsAmount > 0) {
    newSystemTxs.push({
      id: generateId(),
      date,
      amount: -Math.abs(savingsAmount),
      category: "Savings",
      isSystem: true,
      note: "Auto Savings",
    });
  }

  await saveTransactions([...userTxs, ...newSystemTxs]);
}
