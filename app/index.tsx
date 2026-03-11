import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Settings, RefreshCw } from "lucide-react-native";
import { Transaction, ExpandedCard, ViewMode, FilterType } from "@/types";
import { useAppData } from "@/hooks/useAppData";
import { useBudget } from "@/hooks/useBudget";
import { useTransactions } from "@/hooks/useTransactions";
import { useDateNavigation } from "@/hooks/useDateNavigation";
import { useUndoDelete } from "@/hooks/useUndoDelete";
import { DateNavigator } from "@/components/dashboard/DateNavigator";
import { DayView } from "@/components/dashboard/DayView";
import { MonthView } from "@/components/dashboard/MonthView";
import { AddTransactionModal } from "@/components/dashboard/AddTransactionModal";
import { EditTransactionModal } from "@/components/dashboard/EditTransactionModal";
import { SnackBar } from "@/components/ui/SnackBar";
import { COLORS } from "@/constants/theme";

export default function Dashboard() {
  const router = useRouter();
  const { config, transactions, setTransactions, isLoading, refresh } =
    useAppData();

  const [refreshing, setRefreshing] = useState(false);
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [filter, setFilter] = useState<FilterType>("All");

  const {
    selectedDateISO,
    showDatePicker,
    shiftSelectedDate,
    handleDateChange,
    openDatePicker,
    closeDatePicker,
  } = useDateNavigation();

  const budget = useBudget(config, transactions, selectedDateISO);

  const { addTransaction, editTransaction } = useTransactions({
    transactions,
    setTransactions,
    selectedDateISO,
  });

  const { pendingDelete, handleDelete, handleUndo } = useUndoDelete({
    transactions,
    setTransactions,
  });

  // Redirect to setup if no config
  useEffect(() => {
    if (!isLoading && !config) {
      router.replace("/setup");
    }
  }, [isLoading, config, router]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleToggleCard = useCallback(
    (card: "period" | "today") => {
      setExpandedCard(expandedCard === card ? null : card);
    },
    [expandedCard]
  );

  const handleStartEdit = useCallback((tx: Transaction) => {
    setEditingTx(tx);
  }, []);

  const handleSaveEdit = useCallback(
    async (
      id: string,
      date: string,
      amount: number,
      category: Parameters<typeof editTransaction>[3],
      note: string
    ) => {
      await editTransaction(id, date, amount, category, note);
    },
    [editTransaction]
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  if (!config || !budget) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="p-6 flex-row justify-between items-center">
          <DateNavigator
            selectedDateISO={selectedDateISO}
            showDatePicker={showDatePicker}
            onShiftDate={shiftSelectedDate}
            onOpenDatePicker={openDatePicker}
            onCloseDatePicker={closeDatePicker}
            onDateChange={handleDateChange}
          />
          <View className="flex-row gap-4">
            <Pressable onPress={onRefresh} className="p-2">
              <RefreshCw size={24} color={COLORS.textSecondary} />
            </Pressable>
            <Link href="/setup" asChild>
              <Pressable className="p-2">
                <Settings size={24} color={COLORS.textSecondary} />
              </Pressable>
            </Link>
          </View>
        </View>

        {viewMode === "day" ? (
          <DayView
            budget={budget}
            config={config}
            transactions={transactions}
            selectedDateISO={selectedDateISO}
            expandedCard={expandedCard}
            onToggleCard={handleToggleCard}
            onOpenAdd={() => setShowAddModal(true)}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
            filter={filter}
            onFilterChange={(f) => setFilter(f as FilterType)}
          />
        ) : (
          <MonthView
            budget={budget}
            transactions={transactions}
            selectedDateISO={selectedDateISO}
            rolloverUnspent={config.rolloverUnspent ?? false}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
          />
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View className="border-t border-border bg-background">
        <View className="flex-row items-stretch">
          <Pressable
            onPress={() => setViewMode("day")}
            className={`flex-1 py-4 items-center ${
              viewMode === "day" ? "bg-accent/10" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                viewMode === "day" ? "text-accent" : "text-secondary"
              }`}
            >
              Day + Log
            </Text>
          </Pressable>
          <View className="w-px bg-border" />
          <Pressable
            onPress={() => setViewMode("period")}
            className={`flex-1 py-4 items-center ${
              viewMode === "period" ? "bg-accent/10" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                viewMode === "period" ? "text-accent" : "text-secondary"
              }`}
            >
              Month Breakdown
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Modals */}
      <AddTransactionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addTransaction}
      />

      <EditTransactionModal
        transaction={editingTx}
        onClose={() => setEditingTx(null)}
        onSave={handleSaveEdit}
      />

      {/* Undo Snackbar */}
      <SnackBar
        message={
          pendingDelete
            ? `Deleted ${pendingDelete.tx.category}`
            : ""
        }
        onAction={handleUndo}
        visible={!!pendingDelete}
      />
    </SafeAreaView>
  );
}
