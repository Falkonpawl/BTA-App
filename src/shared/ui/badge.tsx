import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type BadgeVariant = "primary" | "success" | "info" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const VARIANT_COLORS: Record<BadgeVariant, string> = {
  primary: "#1BC4EA", // Повторный приём - голубой
  success: "#009C6A", // Первичный приём - зелёный
  info: "#026FD5", // Осмотр, коррекция - синий
  default: "#616161",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: VARIANT_COLORS[variant] }]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: "Montserrat-Medium",
    fontSize: 10,
    letterSpacing: -0.3,
  },
});
