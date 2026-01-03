import { Select, TextArea, TextInput } from "@/shared/ui";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PatientFormData } from "../model";

interface PatientFormFieldsProps {
  formData: PatientFormData;
  showErrors: boolean;
  specialFeaturesError: string;
  onUpdateField: (field: string, value: any) => void;
  onPhoneChange: (text: string) => void;
  onDateChange: (text: string) => void;
  onOpenGenderModal: () => void;
  onOpenIntervalModal: () => void;
  onOpenMessengerModal: () => void;
}

export function PatientFormFields({
  formData,
  showErrors,
  specialFeaturesError,
  onUpdateField,
  onPhoneChange,
  onDateChange,
  onOpenGenderModal,
  onOpenIntervalModal,
  onOpenMessengerModal,
}: PatientFormFieldsProps) {
  return (
    <>
      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* First Name */}
        <TextInput
          placeholder="Имя *"
          placeholderTextColor={
            showErrors && !formData.firstName ? "#d7131f" : undefined
          }
          value={formData.firstName}
          onChangeText={(text: string) => onUpdateField("firstName", text)}
          error={showErrors && !formData.firstName}
        />

        {/* Last Name */}
        <TextInput
          placeholder="Фамилия"
          value={formData.lastName}
          onChangeText={(text: string) => onUpdateField("lastName", text)}
        />

        {/* Middle Name */}
        <TextInput
          placeholder="Отчество"
          value={formData.middleName}
          onChangeText={(text: string) => onUpdateField("middleName", text)}
        />

        {/* Gender and Birth Date Row */}
        <View style={styles.row}>
          <Select
            value={formData.gender || "Пол *"}
            onPress={onOpenGenderModal}
            style={styles.genderSelect}
            error={showErrors && !formData.gender}
          />
          <TextInput
            placeholder="Дата рождения"
            value={formData.birthDate}
            onChangeText={onDateChange}
            keyboardType="number-pad"
            maxLength={10}
            containerStyle={styles.dateInput}
          />
        </View>

        {/* Phone */}
        <TextInput
          placeholder="+ 7 (---) --- -- -- *"
          placeholderTextColor="#d7131f"
          value={formData.phone}
          onChangeText={onPhoneChange}
          keyboardType="phone-pad"
          maxLength={18}
          error={showErrors && !formData.phone}
        />

        {/* Special Features - Text Area */}
        <View style={styles.textAreaContainer}>
          <TextArea
            placeholder="Особенности пациента"
            value={formData.specialFeatures}
            onChangeText={(text: string) =>
              onUpdateField("specialFeatures", text)
            }
            numberOfLines={4}
            error={!!specialFeaturesError}
          />
        </View>

        {/* Reminder Interval */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Интервал напоминания для повторной процедуры:
          </Text>
          <Select
            value={formData.reminderInterval}
            onPress={onOpenIntervalModal}
          />
        </View>

        {/* Messenger */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Мессенджер для напоминаний:</Text>
          <Select value={formData.messenger} onPress={onOpenMessengerModal} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 24,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  genderSelect: {
    flex: 1,
  },
  dateInput: {
    flex: 2,
  },
  textAreaContainer: {
    marginTop: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: "#222221",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
    fontFamily: "Montserrat",
  },
});
