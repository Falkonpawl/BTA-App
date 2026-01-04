import {
  ExitConfirmationModal,
  formatDate,
  formatPhoneNumber,
  GENDERS,
  hasRequiredFieldErrors,
  hasUnsavedChanges,
  MESSENGERS,
  PatientFormCheckboxes,
  PatientFormFields,
  REMINDER_INTERVALS,
  SelectionModal,
  validateSpecialFeatures,
  ValidationErrors,
  type PatientFormData,
} from "@/features/patient-registration";
import { Patient, Gender, MessengerType, deserializePatient, SerializedPatient } from "@/entities/patient";
import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "EditPatient">;

function patientToFormData(patient: Patient): PatientFormData {
  const formatDateForForm = (date?: Date): string => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return "";
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const genderToForm = (gender?: Gender): string => {
    if (!gender) return "";
    return gender === Gender.MALE ? "Муж" : "Жен";
  };

  const messengerToForm = (messenger?: MessengerType): string => {
    if (!messenger) return "WhatsApp";
    const mapping: Record<MessengerType, string> = {
      [MessengerType.WHATSAPP]: "WhatsApp",
      [MessengerType.TELEGRAM]: "Telegram",
      [MessengerType.VIBER]: "Viber",
    };
    return mapping[messenger] || "WhatsApp";
  };

  return {
    firstName: patient.firstName || "",
    lastName: patient.lastName || "",
    middleName: patient.middleName || "",
    gender: genderToForm(patient.gender),
    birthDate: formatDateForForm(patient.birthDate),
    phone: patient.phone || "",
    specialFeatures: patient.specialFeatures || "",
    reminderInterval: patient.reminderInterval || "4 мес",
    messenger: messengerToForm(patient.messenger),
    refuseReminders: patient.refuseReminders || false,
    agreeToOffer: false, // These are not stored in Patient
    agreeToPrivacy: false,
  };
}

export function EditPatientScreen({ route, navigation }: Props) {
  const patient = useMemo(() => {
    try {
      const serialized = route.params?.patient as SerializedPatient | undefined
      if (!serialized) {
        console.warn("Patient data not found in route params")
        return null
      }
      return deserializePatient(serialized)
    } catch (error) {
      console.error("Error deserializing patient:", error)
      return null
    }
  }, [route.params?.patient])
  
  const initialFormData = useMemo(() => {
    if (!patient) {
      return {
        firstName: "",
        lastName: "",
        middleName: "",
        gender: "",
        birthDate: "",
        phone: "",
        specialFeatures: "",
        reminderInterval: "4 мес",
        messenger: "WhatsApp",
        refuseReminders: false,
        agreeToOffer: false,
        agreeToPrivacy: false,
      } as PatientFormData;
    }
    return patientToFormData(patient);
  }, [patient]);
  
  const [formData, setFormData] = useState<PatientFormData>(() => initialFormData);
  const [showErrors, setShowErrors] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showIntervalModal, setShowIntervalModal] = useState(false);
  const [showMessengerModal, setShowMessengerModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [specialFeaturesError, setSpecialFeaturesError] = useState("");
  const [canExit, setCanExit] = useState(false);
  
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (canExit || !hasUnsavedChanges(formData, initialFormData)) {
        return;
      }

      e.preventDefault();
      setShowExitModal(true);
    });

    return unsubscribe;
  }, [navigation, formData, canExit, initialFormData]);

  if (!patient) {
    return (
      <MainLayout
        title="Картотека"
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showFab={false}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Пациент не найден</Text>
        </View>
      </MainLayout>
    );
  }

  const handleExit = () => {
    setShowExitModal(false);
    setCanExit(true);
    setTimeout(() => {
      navigation.goBack();
    }, 0);
  };

  const handleSubmit = () => {
    const requiredFieldsError = hasRequiredFieldErrors(formData);
    const specialFeaturesValidation = validateSpecialFeatures(
      formData.specialFeatures
    );

    if (requiredFieldsError || specialFeaturesValidation) {
      setShowErrors(true);
      setSpecialFeaturesError(specialFeaturesValidation);
      return;
    }

    console.log("Updated form data:", formData);
    
    Alert.alert("Успешно", "Данные пациента обновлены", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "specialFeatures") {
      const error = validateSpecialFeatures(value);
      setSpecialFeaturesError(error);
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    updateField("phone", formatted);
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    updateField("birthDate", formatted);
  };

  return (
    <MainLayout
      title="Картотека"
      onBackPress={() => navigation.goBack()}
      showBackButton={true}
      showFab={false}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <PatientFormFields
          formData={formData}
          showErrors={showErrors}
          specialFeaturesError={specialFeaturesError}
          onUpdateField={updateField}
          onPhoneChange={handlePhoneChange}
          onDateChange={handleDateChange}
          onOpenGenderModal={() => setShowGenderModal(true)}
          onOpenIntervalModal={() => setShowIntervalModal(true)}
          onOpenMessengerModal={() => setShowMessengerModal(true)}
        />

        <PatientFormCheckboxes
          refuseReminders={formData.refuseReminders}
          agreeToOffer={formData.agreeToOffer}
          agreeToPrivacy={formData.agreeToPrivacy}
          onUpdateField={updateField}
        />

        <Button
          title="Сохранить"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          style={styles.submitButton}
        />

        {showErrors && (
          <ValidationErrors
            hasRequiredErrors={hasRequiredFieldErrors(formData)}
            specialFeaturesError={specialFeaturesError}
          />
        )}
      </ScrollView>

      <SelectionModal
        visible={showGenderModal}
        title="Выберите пол"
        options={GENDERS}
        selectedValue={formData.gender}
        onSelect={(value) => updateField("gender", value)}
        onClose={() => setShowGenderModal(false)}
      />

      <SelectionModal
        visible={showIntervalModal}
        title="Выберите интервал"
        options={REMINDER_INTERVALS}
        selectedValue={formData.reminderInterval}
        onSelect={(value) => updateField("reminderInterval", value)}
        onClose={() => setShowIntervalModal(false)}
      />

      <SelectionModal
        visible={showMessengerModal}
        title="Выберите мессенджер"
        options={MESSENGERS}
        selectedValue={formData.messenger}
        onSelect={(value) => updateField("messenger", value)}
        onClose={() => setShowMessengerModal(false)}
      />

      <ExitConfirmationModal
        visible={showExitModal}
        onStay={() => setShowExitModal(false)}
        onExit={handleExit}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  submitButton: {
    marginTop: 32,
    marginBottom: 20,
    marginHorizontal: 24,
  },
});

