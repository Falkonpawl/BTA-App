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

// Convert Patient to PatientFormData
function patientToFormData(patient: Patient): PatientFormData {
  const formatDateForForm = (date?: Date): string => {
    if (!date) return "";
    // Ensure date is a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return "";
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Convert Gender enum to form format
  const genderToForm = (gender?: Gender): string => {
    if (!gender) return "";
    return gender === Gender.MALE ? "Муж" : "Жен";
  };

  // Convert MessengerType enum to form format
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
  // Deserialize patient from navigation params
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
  
  // Initialize form data from patient (use empty form if patient is null)
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
  
  // Update form data when patient changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  // Intercept back navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Allow exit if canExit flag is set or no unsaved changes
      if (canExit || !hasUnsavedChanges(formData, initialFormData)) {
        return;
      }

      e.preventDefault();
      setShowExitModal(true);
    });

    return unsubscribe;
  }, [navigation, formData, canExit, initialFormData]);

  // Early return after all hooks
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
    // Use setTimeout to ensure state is updated before navigation
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
    
    // TODO: Implement API call to update patient
    Alert.alert("Успешно", "Данные пациента обновлены", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate special features in real-time
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
        {/* Form Fields */}
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

        {/* Checkboxes */}
        <PatientFormCheckboxes
          refuseReminders={formData.refuseReminders}
          agreeToOffer={formData.agreeToOffer}
          agreeToPrivacy={formData.agreeToPrivacy}
          onUpdateField={updateField}
        />

        {/* Submit Button */}
        <Button
          title="Сохранить"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          style={styles.submitButton}
        />

        {/* Error Messages */}
        {showErrors && (
          <ValidationErrors
            hasRequiredErrors={hasRequiredFieldErrors(formData)}
            specialFeaturesError={specialFeaturesError}
          />
        )}
      </ScrollView>

      {/* Gender Selection Modal */}
      <SelectionModal
        visible={showGenderModal}
        title="Выберите пол"
        options={GENDERS}
        selectedValue={formData.gender}
        onSelect={(value) => updateField("gender", value)}
        onClose={() => setShowGenderModal(false)}
      />

      {/* Reminder Interval Modal */}
      <SelectionModal
        visible={showIntervalModal}
        title="Выберите интервал"
        options={REMINDER_INTERVALS}
        selectedValue={formData.reminderInterval}
        onSelect={(value) => updateField("reminderInterval", value)}
        onClose={() => setShowIntervalModal(false)}
      />

      {/* Messenger Selection Modal */}
      <SelectionModal
        visible={showMessengerModal}
        title="Выберите мессенджер"
        options={MESSENGERS}
        selectedValue={formData.messenger}
        onSelect={(value) => updateField("messenger", value)}
        onClose={() => setShowMessengerModal(false)}
      />

      {/* Exit Confirmation Modal */}
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

