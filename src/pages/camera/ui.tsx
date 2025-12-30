import { INJECTION_ZONES } from "@/features/injection-zones";
import { MainStackParamList } from "@/shared/types/navigation";
import { MainLayout } from "@/shared/ui";
import LightningIcon from "@/src/shared/icons/LightningIcon";
import TakePhotoIcon from "@/src/shared/icons/TakePhotoIcon";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { Check, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "CameraScreen">;

type CameraState =
  | "requesting-permission"
  | "ready"
  | "reviewing-photo"
  | "confirm-retake";

export function CameraScreen({ route, navigation }: Props) {
  const { appointmentType, selectedZones, currentZoneIndex } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraState, setCameraState] = useState<CameraState>(
    "requesting-permission"
  );
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [allPhotos, setAllPhotos] = useState<{ zoneId: string; uri: string }[]>(
    []
  );
  const cameraRef = useRef<CameraView>(null);

  const currentZone = INJECTION_ZONES.find(
    (z) => z.id === selectedZones[currentZoneIndex]
  );

  const getZoneInstruction = (zoneName: string) => {
    switch (zoneName.toLowerCase()) {
      case "межбровье":
      case "glabella":
        return "Межбровье.\nСделайте фото в статике.";
      case "лоб":
      case "forehead":
        return "Лоб.\nСделайте фото в мимике.";
      default:
        return `${zoneName}.\nСделайте фото.`;
    }
  };

  const handlePermissionRequest = async (type: "allow" | "once" | "cancel") => {
    if (type === "cancel") {
      navigation.goBack();
      return;
    }

    const result = await requestPermission();
    if (result.granted) {
      setCameraState("ready");
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo) {
        setCapturedPhoto(photo.uri);
        setCameraState("reviewing-photo");
      }
    }
  };

  const handleAcceptPhoto = () => {
    if (!capturedPhoto || !currentZone) return;

    // Save current photo
    const updatedPhotos = [
      ...allPhotos,
      { zoneId: currentZone.id, uri: capturedPhoto },
    ];
    setAllPhotos(updatedPhotos);

    if (currentZoneIndex < selectedZones.length - 1) {
      // Move to next zone
      navigation.setParams({
        currentZoneIndex: currentZoneIndex + 1,
      });
      setCapturedPhoto(null);
      setCameraState("ready");
    } else {
      // All zones completed, navigate to drug distribution selection
      navigation.navigate("SelectDrugDistribution", {
        appointmentType,
        selectedZones,
        photos: updatedPhotos,
      });
    }
  };

  const handleRejectPhoto = () => {
    setCameraState("confirm-retake");
  };

  const handleConfirmRetake = () => {
    setCapturedPhoto(null);
    setCameraState("ready");
  };

  const handleCancelRetake = () => {
    setCameraState("reviewing-photo");
  };

  // Permission Request Modal
  if (!permission || cameraState === "requesting-permission") {
    return (
      <MainLayout
        title={appointmentType}
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showFab={false}
      >
        <View style={styles.darkBackground}>
          <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={() => navigation.goBack()}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.permissionModal}>
                <Text style={styles.permissionText}>
                  Разрешить BTA Assist делать фотографии и записывать видео?
                </Text>

                <TouchableOpacity
                  style={styles.buttonSpacing}
                  onPress={() => handlePermissionRequest("allow")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#56B5B3", "#1F7876"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryButtonText}>Разрешить</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonSpacing}
                  onPress={() => handlePermissionRequest("once")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#4D4D4C", "#212120"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.blackButton}
                  >
                    <Text style={styles.blackButtonText}>
                      Только в этот раз
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handlePermissionRequest("cancel")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#F4F4F4", "#E2E2E2"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.grayButton}
                  >
                    <Text style={styles.grayButtonText}>Отмена</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </MainLayout>
    );
  }

  // Confirm Retake Modal
  if (cameraState === "confirm-retake") {
    return (
      <MainLayout
        title={appointmentType}
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showFab={false}
      >
        <View style={styles.darkBackground}>
          {capturedPhoto && (
            <Image
              source={{ uri: capturedPhoto }}
              style={styles.photoPreview}
            />
          )}

          <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCancelRetake}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.retakeModal}>
                <Text style={styles.retakeText}>
                  Удалить фото и переснять заново?
                </Text>

                <TouchableOpacity
                  style={styles.buttonSpacing}
                  onPress={handleConfirmRetake}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#56B5B3", "#1F7876"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryButtonText}>Да</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCancelRetake}
                  activeOpacity={0.8}
                  style={styles.closeButton}
                >
                  <View style={styles.closeButtonCircle}>
                    <X size={24} color="#FFFFFF" strokeWidth={2} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </MainLayout>
    );
  }

  // Camera View
  if (cameraState === "ready") {
    return (
      <MainLayout
        title={appointmentType}
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showFab={false}
      >
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            enableTorch={flashEnabled}
          >
            <View style={styles.cameraOverlay}>
              <Text style={styles.instructionText}>
                {currentZone ? getZoneInstruction(currentZone.name) : ""}
              </Text>

              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.flashButton}
                  onPress={() => setFlashEnabled(!flashEnabled)}
                  activeOpacity={0.8}
                >
                  <LightningIcon
                    fill={
                      flashEnabled ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCapture} activeOpacity={0.8}>
                  <TakePhotoIcon />
                </TouchableOpacity>

                <View style={styles.flashButtonPlaceholder} />
              </View>
            </View>
          </CameraView>
        </View>
      </MainLayout>
    );
  }

  // Photo Review
  if (cameraState === "reviewing-photo" && capturedPhoto) {
    return (
      <MainLayout
        title={appointmentType}
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showFab={false}
      >
        <View style={styles.reviewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.photoPreview} />

          <Text style={styles.instructionText}>
            {currentZone ? getZoneInstruction(currentZone.name) : ""}
          </Text>

          <View style={styles.reviewControls}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleRejectPhoto}
              activeOpacity={0.8}
            >
              <X size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAcceptPhoto}
              activeOpacity={0.8}
            >
              <Check size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </MainLayout>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  darkBackground: {
    flex: 1,
    backgroundColor: "#222221",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    width: 310,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 5,
  },
  permissionText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#222221",
    textAlign: "center",
    marginBottom: 25,
    letterSpacing: -0.48,
    lineHeight: 22,
  },
  buttonSpacing: {
    marginBottom: 10,
  },
  primaryButton: {
    width: 270,
    height: 50,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  primaryButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#FFFFFF",
    letterSpacing: -0.36,
  },
  blackButton: {
    width: 270,
    height: 50,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  blackButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#FFFFFF",
    letterSpacing: -0.36,
  },
  grayButton: {
    width: 270,
    height: 50,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  grayButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#3D3D3D",
    letterSpacing: -0.36,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#222221",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  instructionText: {
    paddingTop: 30,
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.48,
    lineHeight: 22,
    paddingHorizontal: 40,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 36,
  },
  flashButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  flashButtonPlaceholder: {
    width: 40,
  },
  captureButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  captureButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
  },
  reviewContainer: {
    flex: 1,
    backgroundColor: "#222221",
    justifyContent: "space-between",
  },
  photoPreview: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  reviewControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 36,
    paddingBottom: 40,
    zIndex: 10,
  },
  rejectButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D7131F",
  },
  acceptButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
    backgroundColor: "#009C6A",
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  retakeModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    width: 310,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 5,
  },
  retakeText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#222221",
    textAlign: "center",
    marginBottom: 25,
    letterSpacing: -0.48,
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
  },
});
