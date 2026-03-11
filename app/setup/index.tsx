import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ArrowRight } from "lucide-react-native";
import { Bill, BudgetConfig, SavingsGoal } from "@/types";
import {
  getTodayISO,
  daysInMonth,
  parseDate,
} from "@/lib/dates";
import { calculateFinancials } from "@/lib/calculations";
import { saveConfig, regenerateSystemTransactions, generateId } from "@/lib/storage";
import { formatCurrency, parseMoneyInput } from "@/lib/format";
import { SetupHeader } from "@/components/setup/SetupHeader";
import { BudgetPreview } from "@/components/setup/BudgetPreview";
import { IncomeStep } from "@/components/setup/IncomeStep";
import { BillsStep } from "@/components/setup/BillsStep";
import { SavingsStep } from "@/components/setup/SavingsStep";
import { ReviewStep } from "@/components/setup/ReviewStep";
import { COLORS } from "@/constants/theme";

const PRIVACY_POLICY_URL =
  "https://kevenhypn.github.io/expense-macros/privacy.html";
const SUPPORT_URL =
  "https://kevenhypn.github.io/expense-macros/support.html";

export default function SetupWizard() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [startDate, setStartDate] = useState(getTodayISO());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bills, setBills] = useState<Bill[]>([
    { id: "1", name: "Rent", amount: 0 },
    { id: "2", name: "Phone", amount: 0 },
  ]);
  const [savingsMode, setSavingsMode] = useState<"percent" | "fixed">(
    "percent"
  );
  const [savingsValue, setSavingsValue] = useState("20");
  const [rolloverUnspent, setRolloverUnspent] = useState(true);
  const [errors, setErrors] = useState<{ income?: string }>({});

  const monthlyIncomeNumber = parseFloat(monthlyIncome) || 0;
  const parsedSavingsValue = parseFloat(savingsValue) || 0;
  const clampedPercent = Math.min(100, Math.max(0, parsedSavingsValue));
  const clampedFixed = Math.max(0, parsedSavingsValue);

  const normalizedSavingsGoal: SavingsGoal =
    savingsMode === "percent"
      ? { mode: "percent", percent: clampedPercent }
      : { mode: "fixed", amount: clampedFixed };

  const savingsAmount =
    normalizedSavingsGoal.mode === "percent"
      ? monthlyIncomeNumber * (normalizedSavingsGoal.percent / 100)
      : normalizedSavingsGoal.amount;

  const normalizedBills = useMemo(
    () =>
      bills
        .map((bill) => ({
          ...bill,
          name: bill.name.trim(),
          amount: Math.abs(Number(bill.amount) || 0),
        }))
        .filter((bill) => bill.name.length > 0 && bill.amount > 0),
    [bills]
  );

  const previewFinancials = calculateFinancials({
    startDate,
    monthlyIncome: monthlyIncomeNumber,
    bills: normalizedBills,
    savingsGoal: normalizedSavingsGoal,
    rolloverUnspent,
  });
  const dailyBudget =
    previewFinancials.availableToSpend / Math.max(1, daysInMonth(startDate));

  const onIncomeChange = useCallback((value: string) => {
    const parsed = parseMoneyInput(value);
    setMonthlyIncome(parsed);
    const incomeValue = parseFloat(parsed) || 0;
    setErrors((prev) => ({
      ...prev,
      income:
        incomeValue > 0 ? undefined : "Monthly income must be more than $0.",
    }));
  }, []);

  const onSavingsValueChange = useCallback(
    (value: string) => {
      const parsed = parseMoneyInput(value);
      if (savingsMode === "percent") {
        const asNumber = parseFloat(parsed);
        if (Number.isNaN(asNumber)) {
          setSavingsValue("");
          return;
        }
        setSavingsValue(String(Math.min(100, Math.max(0, asNumber))));
        return;
      }
      setSavingsValue(parsed);
    },
    [savingsMode]
  );

  const addBill = useCallback((name = "") => {
    setBills((prev) => [...prev, { id: generateId(), name, amount: 0 }]);
  }, []);

  const removeBill = useCallback((id: string) => {
    setBills((prev) => prev.filter((bill) => bill.id !== id));
  }, []);

  const updateBill = useCallback(
    (id: string, field: keyof Bill, value: string) => {
      setBills((prev) =>
        prev.map((bill) => {
          if (bill.id !== id) return bill;
          if (field === "name") return { ...bill, name: value };
          return {
            ...bill,
            amount: parseFloat(parseMoneyInput(value)) || 0,
          };
        })
      );
    },
    []
  );

  const handleDateChange = useCallback((_: unknown, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) setStartDate(selectedDate.toLocaleDateString("en-CA"));
  }, []);

  const handleSave = useCallback(async () => {
    const config: BudgetConfig = {
      startDate,
      monthlyIncome: monthlyIncomeNumber,
      bills: normalizedBills,
      savingsGoal: normalizedSavingsGoal,
      rolloverUnspent,
    };
    await saveConfig(config);
    await regenerateSystemTransactions(config);
    router.replace("/");
  }, [
    startDate,
    monthlyIncomeNumber,
    normalizedBills,
    normalizedSavingsGoal,
    rolloverUnspent,
    router,
  ]);

  const openExternal = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Unable to open link", "Please try again later.");
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Unable to open link", "Please try again later.");
    }
  }, []);

  type StepConfig = {
    key: string;
    title: string;
    canNext: boolean;
    optional?: boolean;
    ctaLabel?: string;
  };

  const steps: StepConfig[] = [
    {
      key: "income",
      title: "Income",
      canNext: monthlyIncomeNumber > 0,
    },
    {
      key: "bills",
      title: "Bills",
      canNext: true,
      optional: true,
    },
    {
      key: "savings",
      title: "Savings",
      canNext: true,
      optional: true,
    },
    {
      key: "review",
      title: "Review",
      canNext: true,
      ctaLabel: "Start tracking",
    },
  ];

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const goNext = async () => {
    if (isLastStep) {
      await handleSave();
      return;
    }
    setStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const goBack = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const renderStepContent = () => {
    switch (currentStep.key) {
      case "income":
        return (
          <IncomeStep
            monthlyIncome={monthlyIncome}
            onIncomeChange={onIncomeChange}
            incomeError={errors.income}
            startDate={startDate}
            onOpenDatePicker={() => setShowDatePicker(true)}
            rolloverUnspent={rolloverUnspent}
            onToggleRollover={() => setRolloverUnspent((prev) => !prev)}
          />
        );
      case "bills":
        return (
          <BillsStep
            bills={bills}
            onAddBill={addBill}
            onRemoveBill={removeBill}
            onUpdateBill={updateBill}
          />
        );
      case "savings":
        return (
          <SavingsStep
            savingsMode={savingsMode}
            onSetSavingsMode={setSavingsMode}
            savingsValue={savingsValue}
            onSavingsValueChange={onSavingsValueChange}
            savingsAmount={savingsAmount}
            onSetNone={() => {
              setSavingsMode("fixed");
              setSavingsValue("0");
            }}
          />
        );
      case "review":
        return (
          <ReviewStep
            startDate={startDate}
            rolloverUnspent={rolloverUnspent}
            billCount={normalizedBills.length}
            dailyBudget={dailyBudget}
          />
        );
      default:
        return null;
    }
  };

  const selectedDateValue = parseDate(startDate);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-4">
          <SetupHeader
            currentStep={stepIndex + 1}
            totalSteps={steps.length}
            title={currentStep.title}
            onBack={goBack}
          />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingTop: 20,
              paddingBottom: 28,
              gap: 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View entering={FadeInDown.duration(220)}>
              {renderStepContent()}
            </Animated.View>

            <BudgetPreview
              monthlyIncome={monthlyIncomeNumber}
              startDate={startDate}
              bills={normalizedBills}
              savingsGoal={normalizedSavingsGoal}
            />

            <View className="pt-4 border-t border-border mt-2">
              <Text className="text-xs text-secondary uppercase tracking-wider">
                About
              </Text>
              <View className="flex-row gap-4 mt-2">
                <Pressable
                  onPress={() => openExternal(PRIVACY_POLICY_URL)}
                >
                  <Text className="text-sm text-accent">Privacy Policy</Text>
                </Pressable>
                <Pressable onPress={() => openExternal(SUPPORT_URL)}>
                  <Text className="text-sm text-accent">Support</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>

        <View className="px-6 pb-6 pt-4 border-t border-border bg-background gap-3">
          {currentStep.optional && !isLastStep && (
            <Pressable
              onPress={() =>
                setStepIndex((prev) => Math.min(steps.length - 1, prev + 1))
              }
            >
              <Text className="text-center text-secondary">Skip for now</Text>
            </Pressable>
          )}

          <Pressable
            onPress={goNext}
            disabled={!currentStep.canNext}
            className={`w-full p-4 rounded-xl flex-row items-center justify-center gap-2 ${
              currentStep.canNext ? "bg-accent" : "bg-accent/40"
            }`}
          >
            <Text className="font-bold text-white">
              {currentStep.ctaLabel ?? (isLastStep ? "Finish" : "Next")}
            </Text>
            <ArrowRight size={18} color="#ffffff" />
          </Pressable>
        </View>

        {showDatePicker &&
          (Platform.OS === "ios" ? (
            <Modal
              transparent
              animationType="fade"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <Pressable
                className="flex-1 bg-black/60 justify-end"
                onPress={() => setShowDatePicker(false)}
              >
                <Pressable
                  className="bg-card p-4 rounded-t-2xl"
                  onPress={() => {}}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-primary text-base font-semibold">
                      Select start date
                    </Text>
                    <Pressable onPress={() => setShowDatePicker(false)}>
                      <Text className="text-accent">Done</Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    value={selectedDateValue}
                    mode="date"
                    display="inline"
                    onChange={handleDateChange}
                  />
                </Pressable>
              </Pressable>
            </Modal>
          ) : (
            <DateTimePicker
              value={selectedDateValue}
              mode="date"
              display="calendar"
              onChange={handleDateChange}
            />
          ))}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
