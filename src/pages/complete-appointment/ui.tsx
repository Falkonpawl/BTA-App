import { useUpdateDrive } from "@/shared/api";
import SyringeIcon from "@/shared/icons/SyringeIcon";
import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "CompleteAppointment">;

export function CompleteAppointmentScreen({ route, navigation }: Props) {
  const { patientName, photos, appointmentId } = route.params;

  const [scheduleFollowUp, setScheduleFollowUp] = useState(false);
  const [reminderOption, setReminderOption] = useState<
    "day-before" | "morning" | "none"
  >("day-before");
  const [sendRecommendations, setSendRecommendations] = useState(false);
  const [sendPhotoCollage, setSendPhotoCollage] = useState(false);

  // Hook для завершения записи
  const updateDrive = useUpdateDrive({
    onSuccess: () => {
      console.log("✅ Прием завершен успешно");
      navigation.navigate("AppointmentSuccess");
    },
    onError: (error: any) => {
      console.error("❌ Ошибка завершения приема:", error);
      Alert.alert("Ошибка", "Не удалось завершить прием. Попробуйте еще раз.");
    },
  });

  const handleReminderToggle = (option: "day-before" | "morning" | "none") => {
    setReminderOption(option);
  };

  const handleComplete = () => {
    console.log("🏁 Завершаю прием:", appointmentId);

    // Завершаем запись через API
    if (appointmentId) {
      updateDrive.mutate({
        driveId: Number(appointmentId),
        data: {
          action: "set_complete_state",
          u_a_role: 2, // Роль исполнителя
        },
      });
    } else {
      console.warn("⚠️ Нет appointmentId, переход без API вызова");
      navigation.navigate("AppointmentSuccess");
    }
  };

  return (
    <MainLayout
      title="Первичный прием"
      onBackPress={() => navigation.goBack()}
      showFab={false}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconWrapper}>
            <SyringeIcon />
          </View>
          <View style={styles.checkmarkWrapper}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.headerTitle}>Завершение приема</Text>
        </View>

        {/* Patient Photos */}
        <View style={styles.photosContainer}>
          <View style={styles.photoItem}>
            <Image
              source={{ uri: photos[0]?.uri }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
          <View style={styles.photoItem}>
            <Image
              source={{ uri: photos[1]?.uri || photos[0]?.uri }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
          <View style={styles.photoItem}>
            <Image
              source={{ uri: photos[2]?.uri || photos[0]?.uri }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Patient Name */}
        <Text style={styles.patientName}>{patientName}</Text>

        {/* Schedule Follow-up */}
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>
            Записать пациента на {"\n"}осмотр / коррекцию
          </Text>
          <Switch
            value={scheduleFollowUp}
            onValueChange={setScheduleFollowUp}
            trackColor={{ false: "#E2E2E2", true: "#56B5B3" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E2E2E2"
            style={styles.switch}
          />
        </View>

        {/* Reminder Section */}
        <View style={styles.reminderSection}>
          <Text style={styles.reminderTitle}>
            Отправить напоминание о приеме:
          </Text>

          <View style={styles.reminderOption}>
            <Text style={styles.reminderOptionText}>За сутки до осмотра</Text>
            <Switch
              value={reminderOption === "day-before"}
              onValueChange={() => handleReminderToggle("day-before")}
              trackColor={{ false: "#E2E2E2", true: "#56B5B3" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E2E2E2"
              style={styles.switch}
            />
          </View>

          <View style={styles.reminderOption}>
            <Text style={styles.reminderOptionText}>
              В день осмотра в 07:00
            </Text>
            <Switch
              value={reminderOption === "morning"}
              onValueChange={() => handleReminderToggle("morning")}
              trackColor={{ false: "#E2E2E2", true: "#56B5B3" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E2E2E2"
              style={styles.switch}
            />
          </View>

          <View style={styles.reminderOption}>
            <Text style={styles.reminderOptionText}>Не напоминать</Text>
            <Switch
              value={reminderOption === "none"}
              onValueChange={() => handleReminderToggle("none")}
              trackColor={{ false: "#E2E2E2", true: "#56B5B3" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E2E2E2"
              style={styles.switch}
            />
          </View>
        </View>

        {/* Send Recommendations */}
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>
            Отправить пациенту рекомендации после процедуры
          </Text>
          <Switch
            value={sendRecommendations}
            onValueChange={setSendRecommendations}
            trackColor={{ false: "#E2E2E2", true: "#56B5B3" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E2E2E2"
            style={styles.switch}
          />
        </View>

        {/* Send Photo Collage */}
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Отправить пациенту коллаж фото</Text>
          <Switch
            value={sendPhotoCollage}
            onValueChange={setSendPhotoCollage}
            trackColor={{ false: "#E2E2E2", true: "#56B5B3" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E2E2E2"
            style={styles.switch}
          />
        </View>

        {/* Complete Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Подтвердить и завершить"
            onPress={handleComplete}
            variant="primary"
            textStyle={{ fontSize: 14 }}
            height={60}
            disabled={updateDrive.isPending}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  iconWrapper: {
    width: 26,
    height: 26,
    marginBottom: 10,
  },
  checkmarkWrapper: {
    position: "absolute",
    right: "44.72%",
    top: 6,
    width: 9.103,
    height: 9.103,
  },
  checkmark: {
    fontSize: 8,
    color: "#56B5B3",
  },
  headerTitle: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "500",
    color: "#222221",
    textAlign: "center",
  },
  photosContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 15,
    paddingHorizontal: 40,
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 14,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  patientName: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "500",
    color: "#1F7876",
    textAlign: "center",
    marginBottom: 25,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  settingText: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "500",
    color: "#222221",
    flex: 1,
    paddingRight: 15,
    lineHeight: 24,
    textAlign: "center",
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  reminderSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
    alignItems: "center",
  },
  reminderTitle: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "500",
    color: "#222221",
    marginBottom: 20,
    textAlign: "center",
  },
  reminderOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  reminderOptionText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "400",
    color: "#222221",
    flex: 1,
    paddingRight: 15,
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: "#F6F6F6",
  },
});
