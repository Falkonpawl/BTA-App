import { useCancelDrive } from "@/shared/api";
import { AppointmentDetailScreenProps } from "@/shared/types/navigation";
import { APPOINTMENT_TYPE_LABELS } from "@/src/entities/appointment";
import { mockAppointments } from "@/src/shared/lib/mock-data";
import { CancelAppointmentModal, MainLayout } from "@/src/shared/ui";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function AppointmentDetailPage({
  route,
  navigation,
}: AppointmentDetailScreenProps) {
  const { appointmentId } = route.params;
  const appointment = mockAppointments.find((a) => a.id === appointmentId);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const cancelDrive = useCancelDrive({
    onSuccess: () => {
      console.log("✅ Appointment cancelled successfully");
      setShowCancelModal(false);
      navigation.goBack();
    },
    onError: (error) => {
      console.error("❌ Failed to cancel appointment:", error);
      // TODO: Show error message to user
      setShowCancelModal(false);
    },
  });

  if (!appointment) {
    return (
      <MainLayout
        title="BTA Assist"
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showFab={false}
      >
        <View style={styles.scrollContent}>
          <Text>Запись не найдена</Text>
        </View>
      </MainLayout>
    );
  }

  const formatDate = (date: Date, time: string) => {
    const day = date.getDate();
    const monthNames = [
      "янв.",
      "фев.",
      "мар.",
      "апр.",
      "мая",
      "июн.",
      "июл.",
      "авг.",
      "сен.",
      "окт.",
      "нояб.",
      "дек.",
    ];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}, ${time}`;
  };

  const formatNotificationDate = (date?: Date) => {
    if (!date) return "Не отправлено";
    const day = date.getDate();
    const monthNames = [
      "янв.",
      "фев.",
      "мар.",
      "апр.",
      "мая",
      "июн.",
      "июл.",
      "авг.",
      "сен.",
      "окт.",
      "нояб.",
      "дек.",
    ];
    const month = monthNames[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month}, ${hours}:${minutes}`;
  };

  const procedureText =
    appointment.procedure || APPOINTMENT_TYPE_LABELS[appointment.type];

  const formatFullDate = (date: Date) => {
    const day = date.getDate();
    const monthNames = [
      "янв",
      "фев",
      "мар",
      "апр",
      "мая",
      "июн",
      "июл",
      "авг",
      "сен",
      "окт",
      "нояб",
      "дек",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year} г.`;
  };

  const handleCancelAppointment = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = (notifyPatient: boolean) => {
    console.log("Canceling appointment, notify patient:", notifyPatient);
    // TODO: If notifyPatient is true, navigate to chat or send notification

    // Call API to cancel appointment
    cancelDrive.mutate(appointmentId);
  };

  return (
    <MainLayout
      title="BTA Assist"
      onBackPress={() => navigation.goBack()}
      showBackButton={true}
      showFab={false}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View style={styles.mainCard}>
          {/* Patient Photo */}
          <View style={styles.photoContainer}>
            {appointment.imageUrl ? (
              <Image
                source={{ uri: appointment.imageUrl }}
                style={styles.photo}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.photoPlaceholder} />
            )}
          </View>

          {/* Patient Name */}
          <Text style={styles.patientName}>{appointment.patientName}</Text>

          {/* Info Rows */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Процедура:</Text>
              <Text style={styles.infoProcedure}>{procedureText}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Назначено:</Text>
              <Text style={styles.infoDateScheduled}>
                {formatDate(appointment.date, appointment.time)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Пациент уведомлен:</Text>
              <Text style={styles.infoDateNotified}>
                {formatNotificationDate(appointment.notifiedAt)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Action Items */}
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Карточка пациента</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Отправить напоминание</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Изменить/перенести</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.8}>
              <LinearGradient
                colors={["#56B5B3", "#1F7876"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Начать прием</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonWrapper}
              activeOpacity={0.8}
              onPress={handleCancelAppointment}
              disabled={cancelDrive.isPending}
            >
              <LinearGradient
                colors={["#F55862", "#D7131F"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[
                  styles.dangerButton,
                  cancelDrive.isPending && styles.disabledButton,
                ]}
              >
                <Text style={styles.dangerButtonText}>
                  {cancelDrive.isPending ? "Отмена..." : "Отменить процедуру"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Cancel Appointment Modal */}
      <CancelAppointmentModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        patientName={appointment.patientName}
        procedureType={procedureText}
        appointmentDate={formatFullDate(appointment.date)}
        appointmentTime={appointment.time}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  mainCard: {
    backgroundColor: "rgba(86, 181, 179, 0.25)",
    borderRadius: 18,
    padding: 20,
    marginTop: 8,
  },
  photoContainer: {
    width: 80,
    height: 80,
    borderRadius: 14,
    alignSelf: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
  },
  patientName: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#222221",
    textAlign: "center",
    letterSpacing: -0.54,
    marginBottom: 17,
  },
  infoRow: {
    marginBottom: 5,
  },
  infoCard: {
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 39,
  },
  infoLabel: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#424242",
    letterSpacing: -0.36,
    flex: 1,
  },
  infoProcedure: {
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
    color: "#222221",
    letterSpacing: -0.36,
    textAlign: "right",
    flex: 1,
  },
  infoDateScheduled: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#1F7876",
    letterSpacing: -0.36,
    textAlign: "right",
    flex: 1,
  },
  infoDateNotified: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#009C6A",
    letterSpacing: -0.36,
    textAlign: "right",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginVertical: 14,
  },
  actionItem: {
    paddingVertical: 5,
  },
  actionText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#222221",
    letterSpacing: -0.54,
  },
  buttonContainer: {
    marginTop: 26,
    gap: 10,
  },
  buttonWrapper: {
    borderRadius: 64,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  primaryButton: {
    height: 60,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: -0.42,
  },
  dangerButton: {
    height: 60,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  dangerButtonText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: -0.42,
  },
});
