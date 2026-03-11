import React from "react";
import { View } from "react-native";

type CardProps = {
  children: React.ReactNode;
  variant?: "default" | "alt";
  className?: string;
};

export function Card({ children, variant = "default", className = "" }: CardProps) {
  const base =
    variant === "alt"
      ? "bg-cardAlt border border-border rounded-3xl p-5"
      : "bg-card border border-border rounded-3xl p-5";
  return <View className={`${base} ${className}`}>{children}</View>;
}
