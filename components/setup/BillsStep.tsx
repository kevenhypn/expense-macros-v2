import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Trash2, Plus } from "lucide-react-native";
import { Bill } from "@/types";
import { QUICK_BILLS } from "@/constants/categories";
import { COLORS } from "@/constants/theme";

type BillsStepProps = {
  bills: Bill[];
  onAddBill: (name?: string) => void;
  onRemoveBill: (id: string) => void;
  onUpdateBill: (id: string, field: keyof Bill, value: string) => void;
};

export function BillsStep({
  bills,
  onAddBill,
  onRemoveBill,
  onUpdateBill,
}: BillsStepProps) {
  return (
    <View className="gap-5">
      <View>
        <Text className="text-primary text-2xl font-bold">
          Add recurring bills
        </Text>
        <Text className="text-secondary mt-1">
          Optional now, easy to edit later.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {QUICK_BILLS.map((name) => (
          <Pressable
            key={name}
            onPress={() => onAddBill(name)}
            className="px-3 py-2 rounded-full border border-border bg-borderAlt"
          >
            <Text className="text-xs text-primary">+ {name}</Text>
          </Pressable>
        ))}
      </View>

      <View className="gap-3">
        {bills.map((bill) => (
          <View
            key={bill.id}
            className="bg-borderAlt border border-border rounded-xl p-3 flex-row items-center gap-3"
          >
            <TextInput
              value={bill.name}
              onChangeText={(text) => onUpdateBill(bill.id, "name", text)}
              placeholder="Bill name"
              placeholderTextColor={COLORS.textSecondary}
              className="flex-1 text-primary"
            />

            <View className="flex-row items-center bg-background rounded-lg px-2 w-28">
              <Text className="text-secondary mr-1">$</Text>
              <TextInput
                keyboardType="decimal-pad"
                value={bill.amount ? String(bill.amount) : ""}
                onChangeText={(text) => onUpdateBill(bill.id, "amount", text)}
                placeholder="0"
                placeholderTextColor={COLORS.textSecondary}
                className="flex-1 text-primary py-2 text-right"
              />
            </View>

            <Pressable
              onPress={() => onRemoveBill(bill.id)}
              className="p-1"
              hitSlop={6}
            >
              <Trash2 size={18} color={COLORS.danger} />
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => onAddBill()}
        className="self-start flex-row items-center gap-2 px-3 py-2 rounded-lg border border-border"
      >
        <Plus size={16} color={COLORS.textSecondary} />
        <Text className="text-sm text-secondary">Add bill</Text>
      </Pressable>
    </View>
  );
}
