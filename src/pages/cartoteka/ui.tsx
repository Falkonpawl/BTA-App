import {
  Patient,
  getFullName,
  serializePatient,
  userToPatient,
} from "@/entities/patient"
import { useInnerClients } from "@/shared/api"
import { mockAppointments, mockPatients } from "@/shared/lib/mock-data"
import { MainStackScreenProps } from "@/shared/types/navigation"
import { MainLayout } from "@/shared/ui"
import { CartotekaScreen } from "@/widgets/cartoteka-screen"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React, { useEffect, useMemo, useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type CartotekaScreenProps = MainStackScreenProps<"Cartoteka">

export const CartotekaPage: React.FC<CartotekaScreenProps> = ({
  navigation,
}) => {
  const [showInactiveWarning, setShowInactiveWarning] = useState(false)
  const [inactivePatients, setInactivePatients] = useState<Patient[]>([])

  // Fetch inner clients (patients)
  const innerClients = useInnerClients(undefined)

  // Convert API users to patients
  const patients = useMemo(() => {
    const usersData = innerClients.data?.data
    if (usersData) {
      const userRecord = usersData.user
      if (userRecord && typeof userRecord === "object") {
        const users = Object.values(userRecord)
        const apiPatients = users.map((user: any) => userToPatient(user))
        if (apiPatients.length > 0) {
          return apiPatients
        }
      }
    }

    // Fallback to mock data if API data not available
    console.log("⚠️ Using mock patients (API data not available)")
    return mockPatients
  }, [innerClients.data])

  // Check for inactive patients (no appointments for more than 2 years)
  useEffect(() => {
    if (patients.length === 0) return

    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

    const inactive: Patient[] = []

    patients.forEach((patient) => {
      const fullName = getFullName(patient)
      // Find last appointment for this patient
      const patientAppointments = mockAppointments.filter(
        (apt) => apt.patientName === fullName
      )

      if (patientAppointments.length === 0) {
        // No appointments at all - check by updatedAt
        if (patient.updatedAt && patient.updatedAt < twoYearsAgo) {
          inactive.push(patient)
        }
      } else {
        // Find most recent appointment
        const lastAppointment = patientAppointments.reduce((latest, current) =>
          current.date > latest.date ? current : latest
        )

        if (lastAppointment.date < twoYearsAgo) {
          inactive.push(patient)
        }
      }
    })

    if (inactive.length > 0) {
      setInactivePatients(inactive)
      setShowInactiveWarning(true)
    }
  }, [patients])

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleAddPatient = () => {
    navigation.navigate("AddPatient")
  }

  const handlePatientPress = (patient: Patient) => {
    navigation.navigate("PatientDetail", { patient: serializePatient(patient) })
  }

  const handleCloseWarning = () => {
    setShowInactiveWarning(false)
  }

  const handleDeleteNow = () => {
    // TODO: Implement delete inactive patients
    console.log("Delete inactive patients now")
    setShowInactiveWarning(false)
  }

  const handleCancelDeletion = () => {
    // TODO: Cancel scheduled deletion
    console.log("Cancel deletion")
    setShowInactiveWarning(false)
  }

  return (
    <MainLayout
      title="Картотека"
      onBackPress={handleBackPress}
      showBackButton={true}
      showFab={false}
    >
      <CartotekaScreen
        patients={patients}
        isLoading={innerClients.isLoading}
        isRefreshing={innerClients.isRefetching}
        onRefresh={() => innerClients.refetch()}
        onPatientPress={handlePatientPress}
        onAddPatientPress={handleAddPatient}
      />

      {/* Inactive Patients Warning Modal */}
      <Modal
        visible={showInactiveWarning}
        transparent
        animationType="fade"
        onRequestClose={handleCloseWarning}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Warning Icon */}
            <View style={styles.warningIconContainer}>
              <Ionicons name="warning" size={48} color="#D7131F" />
            </View>

            {/* Message */}
            <Text style={styles.modalTitle}>Внимание! Через 7 дней</Text>
            <Text style={styles.modalMessage}>
              будут удалены карточки{"\n"}
              пациентов, не посещавших{"\n"}
              приём более 2 лет:
            </Text>

            {/* Patient Names */}
            <Text style={styles.patientsList}>
              {inactivePatients
                .slice(0, 2)
                .map((patient) => getFullName(patient))
                .join(", ")}
            </Text>

            {/* Buttons */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                onPress={handleCloseWarning}
                style={styles.modalButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#56B5B3", "#1F7876"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonText}>Хорошо</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteNow}
                style={styles.modalButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#F55862", "#D7131F"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonText}>Удалить сейчас</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancelDeletion}
                style={styles.modalCancelButton}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelButtonText}>
                  Отменить удаление
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </MainLayout>
  )
}

const styles = StyleSheet.create({
  // Inactive Patients Warning Modal Styles
  modalOverlay: {
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
  warningIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#222221",
    textAlign: "center",
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#424242",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },
  patientsList: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#222221",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtonsContainer: {
    width: "100%",
    gap: 12,
  },
  modalButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  modalCancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#424242",
    textAlign: "center",
  },
})
