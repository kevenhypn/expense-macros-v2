import { TransactionCategory } from "@/types";

export type CategoryStyle = {
  color: string;
  bgSelected: string;
  bgUnselected: string;
  bgBadge: string;
  textBadge: string;
  icon: string;
};

export const CATEGORY_CONFIG: Record<TransactionCategory, CategoryStyle> = {
  Food: {
    color: "#E67E22",
    bgSelected: "#E67E22",
    bgUnselected: "#2d1e10",
    bgBadge: "#2d1e10",
    textBadge: "#E6A56E",
    icon: "F",
  },
  Bills: {
    color: "#FF4757",
    bgSelected: "#FF4757",
    bgUnselected: "#3d1515",
    bgBadge: "#3d1515",
    textBadge: "#FF6B7A",
    icon: "B",
  },
  Savings: {
    color: "#4DA6FF",
    bgSelected: "#4DA6FF",
    bgUnselected: "#142833",
    bgBadge: "#142833",
    textBadge: "#4DA6FF",
    icon: "S",
  },
  Shopping: {
    color: "#A855F7",
    bgSelected: "#A855F7",
    bgUnselected: "#2d1a3d",
    bgBadge: "#2d1a3d",
    textBadge: "#C084FC",
    icon: "S",
  },
  Transport: {
    color: "#F59E0B",
    bgSelected: "#F59E0B",
    bgUnselected: "#3d3314",
    bgBadge: "#3d3314",
    textBadge: "#FCD34D",
    icon: "T",
  },
  Entertainment: {
    color: "#6C5CE7",
    bgSelected: "#6C5CE7",
    bgUnselected: "#1a1a3d",
    bgBadge: "#1a1a3d",
    textBadge: "#A78BFA",
    icon: "E",
  },
  Other: {
    color: "#6B7280",
    bgSelected: "#6B7280",
    bgUnselected: "#262626",
    bgBadge: "#262626",
    textBadge: "#9CA3AF",
    icon: "O",
  },
  Income: {
    color: "#00D68F",
    bgSelected: "#00D68F",
    bgUnselected: "#14332a",
    bgBadge: "#14332a",
    textBadge: "#00D68F",
    icon: "I",
  },
};

export const QUICK_BILLS = ["Rent", "Phone", "Car", "Insurance", "Utilities"];
