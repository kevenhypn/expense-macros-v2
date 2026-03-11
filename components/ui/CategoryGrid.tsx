import React from "react";
import { View, Text, Pressable } from "react-native";
import { TransactionCategory, ALL_CATEGORIES } from "@/types";
import { CATEGORY_CONFIG } from "@/constants/categories";

type CategoryGridProps = {
  selected: TransactionCategory;
  onSelect: (c: TransactionCategory) => void;
  allowedCategories?: TransactionCategory[];
};

export function CategoryGrid({
  selected,
  onSelect,
  allowedCategories,
}: CategoryGridProps) {
  const categories = allowedCategories ?? ALL_CATEGORIES;

  return (
    <View className="flex-row flex-wrap gap-2">
      {categories.map((cat) => {
        const isSelected = selected === cat;
        const config = CATEGORY_CONFIG[cat];

        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            style={{
              width: "23%",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              backgroundColor: isSelected
                ? config.bgSelected
                : config.bgUnselected,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: isSelected ? "#FFFFFF" : config.textBadge,
              }}
            >
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
