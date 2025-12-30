import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string | React.ReactNode;
}

export function Checkbox({ checked, onPress, label }: CheckboxProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.checkbox,
          checked ? styles.checkedBox : styles.uncheckedBox,
        ]}
      >
        {checked && <Ionicons name="checkmark" size={12} color="white" />}
      </View>
      {typeof label === "string" ? (
        <Text style={styles.labelText}>{label}</Text>
      ) : (
        label
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    borderColor: "#009c6a",
    backgroundColor: "#009c6a",
  },
  uncheckedBox: {
    borderColor: "#c3c3c3",
    backgroundColor: "transparent",
  },
  labelText: {
    flex: 1,
    color: "#222221",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Montserrat",
  },
});
