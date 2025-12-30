import { INJECTION_ZONES } from "@/features/injection-zones";
import SyringeIcon from "@/shared/icons/SyringeIcon";
import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "InjectionPoints">;

interface InjectionPoint {
  id: number;
  x: number; // позиция в процентах
  y: number; // позиция в процентах
  description: string;
}

export function InjectionPointsScreen({ route, navigation }: Props) {
  const { appointmentType, selectedZones, photos, currentZoneIndex } =
    route.params;
  const [skipInFuture, setSkipInFuture] = useState(false);

  const currentZone = selectedZones[currentZoneIndex];
  const currentPhoto = photos.find((p) => p.zoneId === currentZone);
  const zone = INJECTION_ZONES.find((z) => z.id === currentZone);

  // Пример точек инъекций - в реальном приложении это будет из API или стейта
  const [injectionPoints] = useState<InjectionPoint[]>([
    {
      id: 1,
      x: 20,
      y: 60,
      description:
        "Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта. Проводим детальный анализ вашей ситуации и документов.",
    },
    {
      id: 2,
      x: 45,
      y: 35,
      description:
        "Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта. Проводим детальный анализ вашей ситуации и документов.",
    },
    {
      id: 3,
      x: 75,
      y: 50,
      description:
        "Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта. Проводим детальный анализ вашей ситуации и документов.",
    },
  ]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isLastZone = currentZoneIndex === selectedZones.length - 1;

  const handleComplete = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNext = () => {
    setShowConfirmModal(false);
    if (isLastZone) {
      // Все зоны обработаны, переходим к экрану завершения приема
      navigation.navigate("CompleteAppointment", {
        patientName: "Иванов Олег Евгеньевич",
        photos,
      });
    } else {
      // Перейти к следующей зоне
      navigation.push("InjectionPoints", {
        appointmentType,
        selectedZones,
        photos,
        currentZoneIndex: currentZoneIndex + 1,
      });
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
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
        {/* Zone Badge */}
        <View style={styles.zoneBadge}>
          <View style={styles.zoneBadgeNumberContainer}>
            <Text style={styles.zoneBadgeNumber}>{currentZoneIndex + 1}</Text>
          </View>
          <Text style={styles.zoneBadgeText}>{zone?.name}</Text>
        </View>

        {/* Photo with markers */}
        <View style={styles.photoContainer}>
          <View style={styles.photoWrapper}>
            {currentPhoto && (
              <Image
                source={{ uri: currentPhoto.uri }}
                style={styles.photo}
                resizeMode="cover"
              />
            )}
            {/* Injection point markers */}
            {injectionPoints.map((point) => (
              <View
                key={point.id}
                style={[
                  styles.marker,
                  {
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                  },
                ]}
              >
                <View style={styles.markerCircle}>
                  <Text style={styles.markerText}>{point.id}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Injection point descriptions */}
        {injectionPoints.map((point) => (
          <View key={point.id} style={styles.descriptionCard}>
            <View style={styles.descriptionMarker}>
              <Text style={styles.descriptionMarkerText}>{point.id}</Text>
            </View>
            <Text style={styles.descriptionText}>{point.description}</Text>
          </View>
        ))}

        {/* Skip in future toggle */}
        <View style={styles.skipContainer}>
          <Text style={styles.skipText}>Пропускать этот этап в дальнейшем</Text>
          <Switch
            value={skipInFuture}
            onValueChange={setSkipInFuture}
            trackColor={{ false: "#E2E2E2", true: "#56B5B3" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E2E2E2"
            style={styles.switch}
          />
        </View>

        {/* Complete button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Завершить постановку"
            onPress={handleComplete}
            variant="primary"
            textStyle={{ fontSize: 14 }}
            height={60}
          />
        </View>

        {/* Help text */}
        <Text style={styles.helpText}>Требуется помощь?</Text>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCancelModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContainer}>
              {/* Syringe Icon */}
              <View style={styles.modalIconWrapper}>
                <SyringeIcon />
              </View>

              {/* Text */}
              <Text style={styles.modalText}>
                Вы уверены, что закончили процедуру в зоне{" "}
                <Text style={styles.modalZoneName}>{zone?.name}</Text>, и хотите{" "}
                {isLastZone ? (
                  <Text style={styles.modalZoneName}>завершить прием?</Text>
                ) : (
                  "перейти к следующей зоне?"
                )}
              </Text>

              {/* Buttons */}
              <View style={styles.modalButtonsContainer}>
                <Button
                  title={isLastZone ? "Завершить" : "Далее"}
                  onPress={handleConfirmNext}
                  variant="primary"
                  height={50}
                  textStyle={{ fontSize: 12, fontWeight: "600" }}
                />
                <Button
                  title="Отмена"
                  onPress={handleCancelModal}
                  variant="gray"
                  height={50}
                  textStyle={{ fontSize: 12, fontWeight: "600" }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  zoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#56B5B3",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 38,
    marginTop: 12,
    marginBottom: 25,
  },
  zoneBadgeNumberContainer: {
    minWidth: 0,
  },
  zoneBadgeNumber: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  zoneBadgeText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  photoWrapper: {
    width: 286,
    height: 360,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  marker: {
    position: "absolute",
    transform: [{ translateX: -14 }, { translateY: -14 }],
  },
  markerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1F7876",
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: 37,
    marginBottom: 10,
    padding: 15,
    flexDirection: "row",
    gap: 12,
  },
  descriptionMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1F7876",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  descriptionMarkerText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  descriptionText: {
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: "400",
    color: "#222221",
    lineHeight: 18,
    flex: 1,
  },
  skipContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 10,
    marginBottom: 15,
  },
  skipText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "400",
    color: "#222221",
    flex: 1,
    paddingRight: 10,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  buttonContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: "#F6F6F6",
  },
  helpText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "500",
    color: "#222221",
    textAlign: "center",
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 310,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIconWrapper: {
    width: 26,
    height: 26,
    marginBottom: 20,
    marginTop: 10,
  },
  modalText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "400",
    color: "#222221",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  modalZoneName: {
    fontFamily: "Montserrat",
    fontWeight: "700",
  },
  modalButtonsContainer: {
    gap: 10,
    width: "100%",
  },
});
