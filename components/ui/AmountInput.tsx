import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";

type AmountInputProps = {
  amount: string;
  setAmount: (val: string) => void;
  isIncome: boolean;
  setIsIncome: (val: boolean) => void;
};

export function AmountInput({
  amount,
  setAmount,
  isIncome,
  setIsIncome,
}: AmountInputProps) {
  return (
    <View className="flex-row gap-3 items-stretch h-16">
      <View className="flex-1 bg-borderAlt rounded-2xl flex-row items-center px-4 border border-border">
        <Text className="text-secondary text-xl mr-2">$</Text>
        <TextInput
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#8888A0"
          className="flex-1 text-3xl font-bold text-primary"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <Pressable
        onPress={() => setIsIncome(!isIncome)}
        className={`w-16 h-16 rounded-2xl items-center justify-center border-2 ${
          isIncome
            ? "border-success/50 bg-success/10"
            : "border-danger/50 bg-danger/10"
        }`}
      >
        <Text
          className={`font-bold text-sm ${
            isIncome ? "text-success" : "text-danger"
          }`}
        >
          {isIncome ? "IN" : "OUT"}
        </Text>
      </Pressable>
    </View>
  );
}
