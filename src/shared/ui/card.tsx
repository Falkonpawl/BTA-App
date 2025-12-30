import React from "react";
import { View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <View className={`bg-white rounded-[18px] shadow-sm ${className || ""}`}>
      {children}
    </View>
  );
};
