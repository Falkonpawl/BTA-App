import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface SelectProps {
  value: string;
  onPress: () => void;
  placeholder?: string;
  style?: ViewStyle;
  error?: boolean;
}

export function Select({
  value,
  onPress,
  placeholder,
  style,
  error,
}: SelectProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, error && styles.errorContainer, style]}
    >
      <Text style={[styles.text, error && styles.errorText]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={14} color="#222221" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1,
    borderColor: "#c3c3c3",
    borderRadius: 64,
    justifyContent: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  errorContainer: {
    borderColor: "#d7131f",
  },
  text: {
    flex: 1,
    color: "#222221",
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  errorText: {
    color: "#d7131f",
  },
});
