import {
  Gender,
  MESSENGER_LABELS,
  SerializedPatient,
  deserializePatient,
  getFullName,
  serializePatient,
} from "@/entities/patient"
import { mockAppointments } from "@/shared/lib/mock-data"
import { MainStackScreenProps } from "@/shared/types/navigation"
import { MainLayout } from "@/shared/ui"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React, { useEffect, useMemo, useState } from "react"
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Svg, { Circle, Rect } from "react-native-svg"

type PatientDetailScreenProps = MainStackScreenProps<"PatientDetail">

export const PatientDetailPage: React.FC<PatientDetailScreenProps> = ({
  route,
  navigation,
}) => {
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [timer, setTimer] = useState(7)
  const [showDeletionBanner, setShowDeletionBanner] = useState(true)

  const isFullyFilled = useMemo(() => {
    if (!patient) return false
    return !!(
      patient.firstName &&
      patient.phone &&
      patient.gender &&
      patient.birthDate &&
      patient.specialFeatures &&
      patient.reminderInterval &&
      patient.messenger
    )
  }, [patient])

  const appointmentPhotos = useMemo(() => {
    if (!patient) return []
    const fullName = getFullName(patient)
    const patientAppointments = mockAppointments.filter(
      (apt) => apt.patientName === fullName
    )
    const photos = patientAppointments
      .map((apt) => apt.imageUrl)
      .filter((url): url is string => !!url)

    return photos
  }, [patient])

  const photosToDisplay = useMemo(() => {
    if (appointmentPhotos.length > 0) {
      return appointmentPhotos
        .slice(0, 3)
        .map((url) => ({ type: "url" as const, source: url }))
    } else if (isFullyFilled) {
      const placeholderImage = require("../../II/Rectangle 28.png")
      return [
        { type: "require" as const, source: placeholderImage },
        { type: "require" as const, source: placeholderImage },
        { type: "require" as const, source: placeholderImage },
      ]
    } else {
      return [{ type: "svg" as const }]
    }
  }, [appointmentPhotos, isFullyFilled])

  useEffect(() => {
    if (showDeleteModal && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [showDeleteModal, timer])

  const isInactive = useMemo(() => {
    if (!patient) return false

    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

    const fullName = getFullName(patient)
    const patientAppointments = mockAppointments.filter(
      (apt) => apt.patientName === fullName
    }
  }, [patient])

  const deletionDate = useMemo(() => {
        current.date > latest.date ? current : latest
      )
      return lastAppointment.date < twoYearsAgo
    }
  }, [patient])

  // Calculate deletion date (7 days from now)
  const deletionDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date
  }, [])

  if (!patient) {
    return (
      <MainLayout
        title="Картотека"
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showFab={false}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Пациент не найден</Text>
        </View>
      </MainLayout>
    )
  }

  const fullName = getFullName(patient)

  const formatShortDate = (date?: Date) => {
    if (!date) return "---"
    // Ensure date is a Date object
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return "---"
    const day = dateObj.getDate()
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
    ]
    const month = monthNames[dateObj.getMonth()]
    return `${day} ${month} ${dateObj.getFullYear()}`
  }

  const handleEditField = (fieldName: string) => {
    // Navigate to edit page with serialized patient data
    navigation.navigate("EditPatient", { patient: serializePatient(patient) })
  }

  const handleDeleteCard = () => {
    setShowDeleteModal(true)
    setTimer(7)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setTimer(7)
  }

  const handleConfirmDelete = () => {
    if (timer === 0) {
      // TODO: Delete patient
      console.log("Delete patient card")
      setShowDeleteModal(false)
      setTimer(7)
    }
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export patient data")
  }

  const handleAppointmentLog = () => {
    navigation.navigate("AppointmentLog", {
      patient: serializePatient(patient),
    })
  }

  // Format deletion date
  const formatDeletionDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const handleCancelDeletion = () => {
    setShowDeletionBanner(false)
    // TODO: Cancel scheduled deletion
    console.log("Cancel deletion")
  }

  return (
    <MainLayout
      title="Картотека"
      onBackPress={() => navigation.goBack()}
      showBackButton={true}
      showFab={false}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card with Gradient Background */}
        <LinearGradient
          colors={
            isFullyFilled
              ? ["rgba(18, 192, 137, 0.3)", "rgba(18, 192, 137, 0.09)"] // 30% to 9% opacity
              : ["rgba(166, 192, 18, 0.3)", "rgba(166, 192, 18, 0.09)"] // 30% to 9% opacity
          }
          locations={[0.205, 0.769]} // 20.5% and 76.9% positions
          start={{ x: 0, y: 0 }} // Top left
          end={{
            x: Math.sin((36.91 * Math.PI) / 180),
            y: Math.cos((36.91 * Math.PI) / 180),
          }} // 36.91deg from vertical
          style={styles.mainCardGradient}
        >
          <View style={styles.mainCard}>
            {/* Photos Section */}
            <View style={styles.photosContainer}>
              {photosToDisplay.length > 0 ? (
                photosToDisplay.map((photo, index) => (
                  <View key={index} style={styles.photoItem}>
                    {photo.type === "url" ? (
                      <Image
                        source={{ uri: photo.source }}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                    ) : photo.type === "svg" ? (
                      <Svg
                        width={80}
                        height={80}
                        viewBox="0 0 80 80"
                        style={styles.photo}
                      >
                        <Rect width="80" height="80" rx="14" fill="#E0E0E0" />
                      </Svg>
                    ) : (
                      <Image
                        source={photo.source}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.photoItem}>
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="person" size={40} color="#9E9E9E" />
                  </View>
                </View>
              )}
            </View>

            {/* Deletion Warning Banner */}
            {isInactive && showDeletionBanner && (
              <>
                <View style={styles.deletionBanner}>
                  <Text style={styles.deletionBannerText}>
                    Карточка будет удалена:
                  </Text>
                  <Text style={styles.deletionBannerDate}>
                    {formatDeletionDate(deletionDate)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleCancelDeletion}
                  style={styles.cancelDeletionButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelDeletionText}>не удалять</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Patient Name with Edit Icon */}
            <View style={styles.nameContainer}>
              <Text style={styles.patientName}>{fullName}</Text>
              <TouchableOpacity
                onPress={() => handleEditField("name")}
                style={styles.editIcon}
              >
                <Ionicons name="pencil" size={16} color="#9E9E9E" />
              </TouchableOpacity>
            </View>

            {/* Info Fields */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Пол</Text>
                <Text style={styles.fieldValue}>
                  {patient.gender === Gender.MALE
                    ? "M"
                    : patient.gender === Gender.FEMALE
                    ? "Ж"
                    : "---"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <TouchableOpacity
                style={styles.fieldCard}
                onPress={() => handleEditField("birthDate")}
                activeOpacity={0.7}
              >
                <Text style={styles.fieldLabel}>Дата рождения</Text>
                <Text style={[styles.fieldValue, styles.editableValue]}>
                  {formatShortDate(patient.birthDate)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldRow}>
              <TouchableOpacity
                style={styles.fieldCard}
                onPress={() => handleEditField("phone")}
                activeOpacity={0.7}
              >
                <Text style={styles.fieldLabel}>Телефон</Text>
                <Text style={[styles.fieldValue, styles.editableValue]}>
                  {patient.phone || "---"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Special Features */}
            <View style={styles.specialFeaturesContainer}>
              <Text style={styles.fieldLabel}>Особенности пациента</Text>
              <TouchableOpacity
                onPress={() => handleEditField("specialFeatures")}
                style={styles.specialFeaturesBox}
              >
                <Text
                  style={[
                    styles.specialFeaturesText,
                    !patient.specialFeatures && styles.placeholderText,
                  ]}
                >
                  {patient.specialFeatures || "---"}
                </Text>
                <Ionicons
                  name="pencil"
                  size={16}
                  color="#56B5B3"
                  style={styles.specialFeaturesEditIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>
                  Интервал напоминания для повторной процедуры
                </Text>
                <Text style={styles.fieldValue}>
                  {patient.reminderInterval || "---"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <TouchableOpacity
                style={styles.fieldCard}
                onPress={() => handleEditField("messenger")}
                activeOpacity={0.7}
              >
                <Text style={styles.fieldLabel}>
                  Мессенджер для напоминаний
                </Text>
                <Text style={[styles.fieldValue, styles.editableValue]}>
                  {patient.messenger && patient.messenger in MESSENGER_LABELS
                    ? MESSENGER_LABELS[
                        patient.messenger as keyof typeof MESSENGER_LABELS
                      ]
                    : "---"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.registrationDateCard}>
                <Text style={styles.fieldLabel}>Дата регистрации</Text>
                <Text style={styles.fieldValue}>
                  {formatShortDate(patient.createdAt)}
                </Text>
              </View>
            </View>

            {/* Notifications Toggle */}
            <View style={styles.toggleContainer}>
              <Text style={styles.fieldLabel}>Уведомления</Text>
              <Switch
                value={!patient.refuseReminders}
                onValueChange={(value) => {
                  // TODO: Update patient refuseReminders
                  console.log("Toggle notifications:", value)
                }}
                trackColor={{ false: "#E0E0E0", true: "#56B5B3" }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Appointment Log */}
            <TouchableOpacity
              onPress={handleAppointmentLog}
              style={styles.appointmentLogButton}
            >
              <Text style={styles.appointmentLogText}>Журнал приемов</Text>
            </TouchableOpacity>

            {/* Delete Card */}
            <TouchableOpacity
              onPress={handleDeleteCard}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Удалить карточку</Text>
            </TouchableOpacity>

            {/* Export Button */}
            <TouchableOpacity
              onPress={handleExport}
              style={styles.exportButtonContainer}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4D4D4C", "#212120"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.exportButtonGradient}
              >
                <Text style={styles.exportButtonText}>Экспорт</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDeleteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Warning Icon */}
            <View style={styles.warningIconContainer}>
              <Ionicons name="warning" size={48} color="#D7131F" />
            </View>

            {/* Message */}
            <Text style={styles.modalTitle}>Внимание! Вы собираетесь</Text>
            <Text style={styles.modalMessage}>
              удалить карточку{" "}
              <Text style={styles.patientNameBold}>{fullName}</Text>.
            </Text>
            <Text style={styles.modalWarning}>Данное действие необратимо.</Text>
            <Text style={styles.modalQuestion}>Продолжить?</Text>

            {/* Timer Circle */}
            <View style={styles.timerContainer}>
              <Svg width={60} height={60} style={styles.timerSvg}>
                {/* Background circle */}
                <Circle
                  cx="30"
                  cy="30"
                  r="28"
                  stroke="#E0E0E0"
                  strokeWidth="2"
                  fill="transparent"
                />
                {/* Progress circle */}
                <Circle
                  cx="30"
                  cy="30"
                  r="28"
                  stroke="#D7131F"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - timer / 7)}
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                />
              </Svg>
              <View style={styles.timerTextContainer}>
                <Text style={styles.timerText}>{timer}</Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                disabled={timer > 0}
                style={styles.modalButton}
                activeOpacity={0.8}
              >
                {timer === 0 ? (
                  <LinearGradient
                    colors={["#F55862", "#D7131F"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.modalButtonGradient}
                  >
                    <Text style={styles.modalButtonTextActive}>
                      Подтверждаю удаление
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.modalButtonDisabled}>
                    <Text style={styles.modalButtonTextDisabled}>
                      Подтверждаю удаление
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCloseDeleteModal}
                style={styles.modalCancelButton}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelButtonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </MainLayout>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#D7131F",
  },
  mainCardGradient: {
    borderRadius: 18,
    marginTop: 8,
    overflow: "hidden",
  },
  mainCard: {
    backgroundColor: "transparent",
    borderRadius: 18,
    padding: 20,
  },
  photosContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  patientName: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#56B5B3",
    letterSpacing: -0.54,
  },
  editIcon: {
    padding: 4,
  },
  fieldRow: {
    marginBottom: 5,
  },
  fieldCard: {
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 39,
  },
  registrationDateCard: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 39,
  },
  fieldLabel: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#424242",
    letterSpacing: -0.36,
    flex: 1,
  },
  fieldValue: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#222221",
    letterSpacing: -0.36,
    textAlign: "right",
    flex: 1,
  },
  editableValue: {
    textDecorationLine: "underline",
    color: "#222221",
  },
  specialFeaturesContainer: {
    marginBottom: 12,
  },
  specialFeaturesBox: {
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    marginTop: 8,
    position: "relative",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  specialFeaturesText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#222221",
    letterSpacing: -0.36,
    paddingRight: 24,
  },
  placeholderText: {
    color: "#9E9E9E",
  },
  specialFeaturesEditIcon: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  appointmentLogButton: {
    marginTop: 8,
    marginBottom: 20,
  },
  appointmentLogText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#56B5B3",
    letterSpacing: -0.48,
  },
  deleteButton: {
    marginBottom: 20,
  },
  deleteText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#D7131F",
    letterSpacing: -0.42,
  },
  exportButtonContainer: {
    borderRadius: 64,
    overflow: "hidden",
    marginTop: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  exportButtonGradient: {
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  exportButtonText: {
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.36,
  },
  // Delete Modal Styles
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
    marginBottom: 8,
  },
  patientNameBold: {
    fontFamily: "Montserrat-Bold",
    fontWeight: "700",
  },
  modalWarning: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#424242",
    textAlign: "center",
    marginBottom: 8,
  },
  modalQuestion: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#222221",
    textAlign: "center",
    marginBottom: 24,
  },
  timerContainer: {
    marginBottom: 24,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  timerSvg: {
    position: "absolute",
  },
  timerTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  },
  timerText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 24,
    color: "#D7131F",
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
  modalButtonDisabled: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  modalButtonTextActive: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  modalButtonTextDisabled: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#9E9E9E",
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
  // Deletion Banner Styles
  deletionBanner: {
    backgroundColor: "#D7131F",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
  },
  deletionBannerText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: -0.36,
  },
  deletionBannerDate: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: -0.36,
  },
  cancelDeletionButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  cancelDeletionText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#56B5B3",
    textDecorationLine: "underline",
  },
})
