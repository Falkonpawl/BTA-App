import {
  ExitConfirmationModal,
  formatDate,
  formatPhoneNumber,
  GENDERS,
  hasRequiredFieldErrors,
  hasUnsavedChanges,
  INITIAL_FORM_DATA,
  MESSENGERS,
  PatientFormCheckboxes,
  PatientFormFields,
  REMINDER_INTERVALS,
  SelectionModal,
  validateSpecialFeatures,
  ValidationErrors,
  type PatientFormData,
} from "@/features/patient-registration";
import { useCreateDrive, useRegister } from "@/shared/api";
import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "AddPatient">;

export function AddPatientScreen({ navigation }: Props) {
  const [formData, setFormData] = useState<PatientFormData>(INITIAL_FORM_DATA);
  const [showErrors, setShowErrors] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showIntervalModal, setShowIntervalModal] = useState(false);
  const [showMessengerModal, setShowMessengerModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [specialFeaturesError, setSpecialFeaturesError] = useState("");
  const [canExit, setCanExit] = useState(false);

  // Hook для создания записи
  const createDrive = useCreateDrive({
    onSuccess: (response) => {
      console.log("✅ Запись создана успешно:", response);
      const appointmentId = response?.data?.b_id || response?.b_id;
      // Navigate to appointment type selection
      navigation.navigate("SelectAppointmentType");
    },
    onError: (error: any) => {
      console.error("❌ Ошибка создания записи:", error);
      Alert.alert("Ошибка", "Не удалось создать запись. Попробуйте еще раз.");
    },
  });

  // Hook для регистрации пациента
  const registerPatient = useRegister({
    onSuccess: (response) => {
      console.log("✅ Пациент зарегистрирован:", response);
      const patientId = response?.data?.u_id || response?.u_id;

      // После успешной регистрации создаем запись
      createDrive.mutate({
        b_start_address: "Адрес клиники",
        b_start_datetime: "now",
        b_payment_way: "2",
        b_options: {}, // Пустой объект, данные пациента уже в u_details
        u_id: patientId,
      });
    },
    onError: (error: any) => {
      console.error("❌ Ошибка регистрации пациента:", error);
      Alert.alert(
        "Ошибка",
        "Не удалось зарегистрировать пациента. Попробуйте еще раз."
      );
    },
  });

  // Intercept back navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Allow exit if canExit flag is set or no unsaved changes
      if (canExit || !hasUnsavedChanges(formData, INITIAL_FORM_DATA)) {
        return;
      }

      e.preventDefault();
      setShowExitModal(true);
    });

    return unsubscribe;
  }, [navigation, formData, canExit]);

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

    console.log("Form data:", formData);

    // Сначала регистрируем пациента
    const fullName =
      `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();

    const u_details: any = {};
    if (formData.messenger) u_details.messenger = formData.messenger;
    if (formData.specialFeatures)
      u_details.special_features = formData.specialFeatures;
    if (formData.birthDate) u_details.birth_date = formData.birthDate;
    if (formData.gender) u_details.gender = formData.gender;
    if (formData.reminderInterval)
      u_details.reminder_interval = formData.reminderInterval;
    u_details.refuse_reminders = formData.refuseReminders;

    registerPatient.mutate({
      u_name: fullName,
      u_phone: formData.phone,
      u_role: "1", // Роль пациента
      st: "1",
      data: JSON.stringify({
        u_details,
      }),
    });
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
      title="Первичный прием"
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
          title="Сохранить и продолжить"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          style={styles.submitButton}
          disabled={registerPatient.isPending || createDrive.isPending}
          loading={registerPatient.isPending || createDrive.isPending}
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
