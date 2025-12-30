import { Checkbox } from "@/shared/ui";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PatientFormCheckboxesProps {
  refuseReminders: boolean;
  agreeToOffer: boolean;
  agreeToPrivacy: boolean;
  onUpdateField: (field: string, value: any) => void;
}

export function PatientFormCheckboxes({
  refuseReminders,
  agreeToOffer,
  agreeToPrivacy,
  onUpdateField,
}: PatientFormCheckboxesProps) {
  return (
    <View style={styles.checkboxContainer}>
      {/* Refuse Reminders */}
      <Checkbox
        checked={refuseReminders}
        onPress={() => onUpdateField("refuseReminders", !refuseReminders)}
        label="Отказаться от напоминаний"
      />

      {/* Agree to Offer */}
      <Checkbox
        checked={agreeToOffer}
        onPress={() => onUpdateField("agreeToOffer", !agreeToOffer)}
        label={
          <Text style={styles.checkboxLabel}>
            Регистрируясь, я подтверждаю, что ознакомился и даю своё согласие с{" "}
            <Text style={styles.link}>публичной офертой</Text>
          </Text>
        }
      />

      {/* Agree to Privacy */}
      <Checkbox
        checked={agreeToPrivacy}
        onPress={() => onUpdateField("agreeToPrivacy", !agreeToPrivacy)}
        label={
          <Text style={styles.checkboxLabel}>
            Регистрируясь, я даю разрешение на обработку своих персональных
            данных в соответствие с действующей{" "}
            <Text style={styles.link}>политикой конфиденциальности</Text>
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    paddingHorizontal: 25,
    marginTop: 24,
    gap: 16,
  },
  checkboxLabel: {
    flex: 1,
    color: "#222221",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Montserrat",
  },
  link: {
    color: "#026fd5",
    textDecorationLine: "underline",
  },
});
