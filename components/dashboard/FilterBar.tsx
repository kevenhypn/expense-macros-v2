import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { FilterType } from "@/types";

type FilterBarProps = {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

const FILTERS: FilterType[] = ["All", "Spending", "Bills", "Savings", "Income"];

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
      className="mb-4"
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <Pressable
            key={filter}
            onPress={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-full border ${
              isActive
                ? "bg-accent/20 border-accent/40"
                : "bg-borderAlt border-border"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                isActive ? "text-accent" : "text-secondary"
              }`}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
