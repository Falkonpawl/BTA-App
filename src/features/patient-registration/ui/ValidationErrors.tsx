import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ValidationErrorsProps {
  hasRequiredErrors: boolean;
  specialFeaturesError: string;
}

export function ValidationErrors({
  hasRequiredErrors,
  specialFeaturesError,
}: ValidationErrorsProps) {
  return (
    <View style={styles.errorMessagesContainer}>
      {hasRequiredErrors && (
        <Text style={styles.errorMessage}>
          Пожалуйста, заполните обязательные поля
        </Text>
      )}
      {specialFeaturesError && (
        <Text style={styles.errorMessage}>
          Поле <Text style={styles.errorMessageBold}>Особенности пациента</Text>{" "}
          не может содержать символы... / Превышать длину в ххх символа.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  errorMessagesContainer: {
    marginBottom: 20,
    gap: 8,
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 12,
    fontWeight: "500",
    color: "#d7131f",
    textAlign: "center",
    fontFamily: "Montserrat",
    letterSpacing: -0.36,
    paddingHorizontal: 20,
  },
  errorMessageBold: {
    fontWeight: "700",
    fontStyle: "italic",
  },
});
