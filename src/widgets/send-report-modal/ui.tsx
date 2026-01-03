import { AppointmentLogEntry } from "@/entities/appointment-log";
import { APPOINTMENT_TYPE_LABELS } from "@/entities/appointment";
import { Patient, MESSENGER_LABELS } from "@/entities/patient";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ReportIcon from "@/shared/icons/ReportIcon";

interface SendReportModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patient: Patient;
  appointment: AppointmentLogEntry;
}

export const SendReportModal: React.FC<SendReportModalProps> = ({
  visible,
  onClose,
  onConfirm,
  patient,
  appointment,
}) => {
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const monthNames = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  const getFullName = () => {
    const parts = [patient.firstName];
    if (patient.middleName) parts.push(patient.middleName);
    if (patient.lastName) parts.push(patient.lastName);
    return parts.join(" ");
  };

  const getContactInfo = () => {
    if (patient.messenger && patient.messenger in MESSENGER_LABELS) {
      return `${MESSENGER_LABELS[patient.messenger as keyof typeof MESSENGER_LABELS]}: ${patient.phone}`;
    }
    return patient.phone;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <ReportIcon width={24} height={28} />
              </View>

              {/* Question */}
              <Text style={styles.questionText}>
                Отправить отчет пациенту?
              </Text>

              {/* Info Card */}
              <View style={styles.infoCard}>
                <Text style={styles.appointmentType}>
                  {APPOINTMENT_TYPE_LABELS[appointment.type]}
                </Text>
                <Text style={styles.label}>Пациент:</Text>
                <Text style={styles.patientName}>{getFullName()}</Text>
                <Text style={styles.dateTime}>
                  {formatDate(appointment.date)} {appointment.time}
                </Text>
                <Text style={styles.contact}>{getContactInfo()}</Text>
              </View>

              {/* Buttons */}
              <TouchableOpacity
                onPress={onConfirm}
                style={styles.sendButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#56B5B3", "#1F7876"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.sendButtonGradient}
                >
                  <Text style={styles.sendButtonText}>Отправить отчет</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={styles.cancelButton}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#222221",
    textAlign: "center",
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  appointmentType: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#222221",
    marginBottom: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  label: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#616161",
    marginBottom: 4,
    textAlign: "center",
  },
  patientName: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#222221",
    marginBottom: 8,
    fontWeight: "700",
    textAlign: "center",
  },
  dateTime: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#222221",
    marginBottom: 8,
    textAlign: "center",
  },
  contact: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#222221",
    textAlign: "center",
  },
  sendButton: {
    width: "100%",
    borderRadius: 64,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  sendButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  sendButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.36,
  },
  cancelButton: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: "#F5F5F5",
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#424242",
    textAlign: "center",
  },
});

