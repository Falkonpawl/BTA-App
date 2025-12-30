import React from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  View,
} from "react-native";

interface TextAreaProps extends TextInputProps {
  minHeight?: number;
  error?: boolean;
}

export function TextArea({ minHeight = 110, error, ...props }: TextAreaProps) {
  return (
    <View
      style={[styles.container, { minHeight }, error && styles.errorContainer]}
    >
      <RNTextInput
        {...props}
        placeholderTextColor={
          error ? "#d7131f" : props.placeholderTextColor || "#222221"
        }
        multiline
        textAlignVertical="top"
        style={[styles.input, error && styles.errorText, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#c3c3c3",
    borderRadius: 24,
    padding: 16,
  },
  errorContainer: {
    borderColor: "#d7131f",
  },
  input: {
    color: "#222221",
    fontSize: 14,
    fontFamily: "Montserrat",
    flex: 1,
  },
  errorText: {
    color: "#d7131f",
  },
});
