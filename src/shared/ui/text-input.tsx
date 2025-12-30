import React from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface CustomTextInputProps extends TextInputProps {
  error?: boolean;
  containerStyle?: ViewStyle;
}

export function TextInput({
  error,
  containerStyle,
  ...props
}: CustomTextInputProps) {
  return (
    <View
      style={[
        styles.container,
        error ? styles.errorBorder : styles.normalBorder,
        containerStyle,
      ]}
    >
      <RNTextInput
        {...props}
        placeholderTextColor={props.placeholderTextColor || "#222221"}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1,
    borderRadius: 64,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  normalBorder: {
    borderColor: "#c3c3c3",
  },
  errorBorder: {
    borderColor: "#d7131f",
  },
  input: {
    color: "#222221",
    fontSize: 14,
    fontFamily: "Montserrat",
  },
});
