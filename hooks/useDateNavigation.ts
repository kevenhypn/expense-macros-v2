import { useState, useCallback } from "react";
import { Platform } from "react-native";
import { getTodayISO, shiftDate, dateToISO } from "@/lib/dates";

export function useDateNavigation() {
  const [selectedDateISO, setSelectedDateISO] = useState(getTodayISO());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const shiftSelectedDate = useCallback(
    (days: number) => {
      setSelectedDateISO(shiftDate(selectedDateISO, days));
    },
    [selectedDateISO]
  );

  const handleDateChange = useCallback(
    (_: unknown, date?: Date) => {
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
      if (date) {
        setSelectedDateISO(dateToISO(date));
      }
    },
    []
  );

  const openDatePicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const closeDatePicker = useCallback(() => {
    setShowDatePicker(false);
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDateISO(getTodayISO());
  }, []);

  return {
    selectedDateISO,
    showDatePicker,
    shiftSelectedDate,
    handleDateChange,
    openDatePicker,
    closeDatePicker,
    goToToday,
  };
}
