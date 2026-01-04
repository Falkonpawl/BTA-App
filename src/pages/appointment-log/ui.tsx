import { AppointmentLogEntry } from "@/entities/appointment-log";
import { APPOINTMENT_TYPE_LABELS, AppointmentType } from "@/entities/appointment";
import { SerializedPatient, deserializePatient, getFullName } from "@/entities/patient";
import { AppointmentLogSort, AppointmentLogSortOption } from "@/features/appointment-log-sort";
import { mockAppointmentLogs } from "@/shared/lib/mock-data";
import { MainStackScreenProps } from "@/shared/types/navigation";
import { MainLayout } from "@/shared/ui";
import { SendReportModal } from "@/widgets/send-report-modal";
import { DownloadReportModal } from "@/widgets/download-report-modal";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AppointmentLogScreenProps = MainStackScreenProps<"AppointmentLog">;

export const AppointmentLogPage: React.FC<AppointmentLogScreenProps> = ({
  route,
  navigation,
}) => {
  const patient = useMemo(() => {
    try {
      const serialized = route.params?.patient as SerializedPatient | undefined;
      if (!serialized) {
        console.warn("Patient data not found in route params");
        return null;
      }
      return deserializePatient(serialized);
    } catch (error) {
      console.error("Error deserializing patient:", error);
      return null;
    }
  }, [route.params?.patient]);

  const [sortOption, setSortOption] = useState<AppointmentLogSortOption>("date-new");
  const [sendReportModalVisible, setSendReportModalVisible] = useState(false);
  const [downloadReportModalVisible, setDownloadReportModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentLogEntry | null>(null);

  const appointmentLogs = useMemo(() => {
    if (!patient) return [];
    let logs = mockAppointmentLogs[patient.id] || [];
    
    // Filter by appointment type if needed
    if (sortOption === "primary") {
      logs = logs.filter((log) => log.type === AppointmentType.PRIMARY);
    } else if (sortOption === "checkup") {
      logs = logs.filter((log) => log.type === AppointmentType.CHECKUP);
    } else if (sortOption === "repeat") {
      logs = logs.filter((log) => log.type === AppointmentType.REPEAT);
    }
    
    // Sort logs
    const sorted = [...logs].sort((a, b) => {
      if (sortOption === "date-new" || sortOption === "primary" || sortOption === "checkup" || sortOption === "repeat") {
        return b.date.getTime() - a.date.getTime();
      } else if (sortOption === "date-old") {
        return a.date.getTime() - b.date.getTime();
      }
      return 0;
    });
    
    return sorted;
  }, [patient, sortOption]);

  if (!patient) {
    return (
      <MainLayout
        title="Журнал приемов"
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showFab={false}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Пациент не найден</Text>
        </View>
      </MainLayout>
    );
  }

  const fullName = getFullName(patient);

  const formatDate = (date: Date) => {
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
    return `${day} ${month}`;
  };

  const formatTime = (time: string) => {
    return time;
  };

  const renderAppointmentCard = (entry: AppointmentLogEntry) => {
    const isScheduled = entry.status === "scheduled";
    const isCompleted = entry.status === "completed";

    return (
      <View
        style={[
          styles.appointmentCard,
          isScheduled && styles.scheduledCard,
          isCompleted && styles.completedCard,
        ]}
      >
        {/* Title */}
        <Text style={styles.appointmentTitle}>
          {APPOINTMENT_TYPE_LABELS[entry.type]}
        </Text>

        {/* Status and Date */}
        <Text style={styles.appointmentStatus}>
          {isScheduled
            ? `Запланирован ${formatDate(entry.date)} ${formatTime(entry.time)}`
            : `Состоялся ${formatDate(entry.date)} ${formatTime(entry.time)}`}
        </Text>

        {/* Treatment Details (only for completed appointments) */}
        {isCompleted && entry.treatment && (
          <>
            <Text style={styles.treatmentText}>
              {entry.treatment.drugName}
            </Text>
            <Text style={styles.treatmentText}>
              {entry.treatment.units} ед.
            </Text>
            <Text style={styles.treatmentText}>
              Зоны: {entry.treatment.zones.join(", ")}
            </Text>

            {/* AI Assistant Note */}
            {entry.note && (
              <Text style={styles.noteText}>{entry.note}</Text>
            )}

            {/* Photos */}
            <View style={styles.photosContainer}>
              {[0, 1, 2].map((index) => {
                const photo = entry.photos && entry.photos[index];
                return (
                  <Image
                    key={index}
                    source={
                      photo
                        ? { uri: photo }
                        : require("../../assets/images/placeholders/patient-placeholder.png")
                    }
                    style={styles.photo}
                    resizeMode="cover"
                  />
                );
              })}
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedAppointment(entry);
                  setSendReportModalVisible(true);
                }}
                style={styles.actionButton}
              >
                <Text style={styles.actionText}>Отправить отчет пациенту</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedAppointment(entry);
                  setDownloadReportModalVisible(true);
                }}
                style={styles.actionButton}
              >
                <Text style={[styles.actionText, styles.downloadText]}>
                  скачать отчет
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Actions for scheduled appointments */}
        {isScheduled && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => {
                // TODO: Configure template
                console.log("Configure template");
              }}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>Настроить шаблон</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // TODO: Notify patient
                console.log("Notify patient");
              }}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>Уведомить пациента</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Журнал приемов пациента</Text>
      <Text style={styles.emptyText}>пока что пуст</Text>
    </View>
  );

  return (
    <MainLayout
      title="Журнал приемов"
      onBackPress={() => navigation.goBack()}
      showBackButton={true}
      showFab={false}
    >
      <View style={styles.container}>
        {/* Patient Name */}
        <Text style={styles.patientName}>{fullName}</Text>

        {/* Sort Option */}
        <AppointmentLogSort
          selectedOption={sortOption}
          onSelect={setSortOption}
        />

        {/* Appointment List */}
        {appointmentLogs.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={appointmentLogs}
            renderItem={({ item }) => renderAppointmentCard(item)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Send Report Modal */}
      {patient && selectedAppointment && (
        <SendReportModal
          visible={sendReportModalVisible}
          onClose={() => {
            setSendReportModalVisible(false);
            setSelectedAppointment(null);
          }}
          onConfirm={() => {
            // TODO: Implement send report
            console.log("Sending report to patient:", patient.id, selectedAppointment.id);
            setSendReportModalVisible(false);
            setSelectedAppointment(null);
          }}
          patient={patient}
          appointment={selectedAppointment}
        />
      )}

      {/* Download Report Modal */}
      {patient && selectedAppointment && (
        <DownloadReportModal
          visible={downloadReportModalVisible}
          onClose={() => {
            setDownloadReportModalVisible(false);
            setSelectedAppointment(null);
          }}
          onConfirm={() => {
            // TODO: Implement download report
            console.log("Downloading report:", patient.id, selectedAppointment.id);
            setDownloadReportModalVisible(false);
            setSelectedAppointment(null);
          }}
          patient={patient}
          appointment={selectedAppointment}
        />
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
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
  patientName: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#56B5B3",
    letterSpacing: -0.54,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  appointmentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scheduledCard: {
    backgroundColor: "#E0F7F6", // Light teal
  },
  completedCard: {
    backgroundColor: "#FFFFFF",
  },
  appointmentTitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#222221",
    marginBottom: 8,
  },
  appointmentStatus: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#424242",
    marginBottom: 12,
    fontWeight: "700",
  },
  treatmentText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#222221",
    marginBottom: 4,
  },
  noteText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#616161",
    marginTop: 8,
    marginBottom: 12,
    fontStyle: "italic",
  },
  photosContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#424242",
    textDecorationLine: "underline",
  },
  downloadText: {
    color: "#56B5B3",
    textDecorationLine: "underline",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
  },
});

