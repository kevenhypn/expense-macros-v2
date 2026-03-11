import React from "react";
import { View, Text, Pressable, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { formatDateLabel, parseDate } from "@/lib/dates";
import { COLORS } from "@/constants/theme";

type DateNavigatorProps = {
  selectedDateISO: string;
  showDatePicker: boolean;
  onShiftDate: (days: number) => void;
  onOpenDatePicker: () => void;
  onCloseDatePicker: () => void;
  onDateChange: (event: unknown, date?: Date) => void;
};

export function DateNavigator({
  selectedDateISO,
  showDatePicker,
  onShiftDate,
  onOpenDatePicker,
  onCloseDatePicker,
  onDateChange,
}: DateNavigatorProps) {
  const selectedDate = parseDate(selectedDateISO);
  const dateLabel = formatDateLabel(selectedDateISO);

  return (
    <>
      <View className="gap-1">
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => onShiftDate(-1)}
            className="py-1"
            hitSlop={10}
          >
            <ChevronLeft size={18} color={COLORS.textSecondary} />
          </Pressable>
          <Pressable
            onPress={onOpenDatePicker}
            className="flex-row items-center"
          >
            <Text className="text-3xl font-bold text-primary">{dateLabel}</Text>
          </Pressable>
          <Pressable
            onPress={() => onShiftDate(1)}
            className="py-1"
            hitSlop={10}
          >
            <ChevronRight size={18} color={COLORS.textSecondary} />
          </Pressable>
        </View>
        <Text className="text-xs text-secondary">Tap date to jump</Text>
      </View>

      {showDatePicker &&
        (Platform.OS === "ios" ? (
          <Modal
            transparent
            animationType="fade"
            visible={showDatePicker}
            onRequestClose={onCloseDatePicker}
          >
            <Pressable
              className="flex-1 bg-black/60 justify-end"
              onPress={onCloseDatePicker}
            >
              <Pressable
                className="bg-card p-4 rounded-t-2xl"
                onPress={() => {}}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-primary text-base font-semibold">
                    Select date
                  </Text>
                  <Pressable onPress={onCloseDatePicker}>
                    <Text className="text-accent">Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="inline"
                  onChange={onDateChange}
                />
              </Pressable>
            </Pressable>
          </Modal>
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={onDateChange}
          />
        ))}
    </>
  );
}
