import { LinearGradient } from "expo-linear-gradient";
import { AlertTriangle } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CancelAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (notifyPatient: boolean) => void;
  patientName: string;
  procedureType: string;
  appointmentDate: string;
  appointmentTime: string;
}

export const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  visible,
  onClose,
  onConfirm,
  patientName,
  procedureType,
  appointmentDate,
  appointmentTime,
}) => {
  const [notifyPatient, setNotifyPatient] = useState(true);

  const handleConfirm = () => {
    onConfirm(notifyPatient);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Warning Icon */}
          <View style={styles.iconContainer}>
            <AlertTriangle size={24} color="#D7131F" />
          </View>

          {/* Message */}
          <Text style={styles.message}>
            <Text style={styles.messageRegular}>
              Внимание! Вы собираетесь отменить запланированный {procedureType}{" "}
              пациента{" "}
            </Text>
            <Text style={styles.messageBold}>{patientName}</Text>
            <Text style={styles.messageRegular}>
              .{"\n"}
              {"\n"}
              Мероприятие назначено{"\n"}
            </Text>
            <Text style={styles.messageBold}>
              на {appointmentTime} {appointmentDate}
              {"\n"}
              {"\n"}
            </Text>
            <Text style={styles.messageRegular}>
              Настоятельно рекомендуем связаться с пациентом и перенести
              процедуру.
            </Text>
          </Text>

          {/* Switch Option */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Перейти в чат с пациентом</Text>
            <Switch
              value={notifyPatient}
              onValueChange={setNotifyPatient}
              trackColor={{ false: "#E0E0E0", true: "#56B5B3" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#56B5B3", "#1F7876"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>Подтверждаю отмену</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Exit Button */}
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#F4F4F4", "#E2E2E2"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.exitButton}
            >
              <Text style={styles.exitButtonText}>Выйти</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    paddingTop: 35,
    paddingBottom: 25,
    paddingHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 26,
  },
  message: {
    fontSize: 16,
    color: "#222221",
    textAlign: "center",
    letterSpacing: -0.48,
    marginBottom: 35,
    lineHeight: 22,
  },
  messageRegular: {
    fontFamily: "Montserrat-Regular",
  },
  messageBold: {
    fontFamily: "Montserrat-Bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  switchLabel: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#222221",
    letterSpacing: -0.42,
    flex: 1,
  },
  buttonWrapper: {
    borderRadius: 64,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  confirmButton: {
    height: 50,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#FFFFFF",
    letterSpacing: -0.36,
  },
  exitButton: {
    height: 50,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  exitButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#3D3D3D",
    letterSpacing: -0.36,
  },
});
