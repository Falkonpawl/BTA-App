import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface IconButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  size?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onPress,
  size = 107,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: size, height: size + 20 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});
