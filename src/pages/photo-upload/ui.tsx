import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import BrainIcon from "@/src/shared/icons/BrainIcon";
import LoaderIcon from "@/src/shared/icons/LoaderIcon";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AlertCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "PhotoUploadScreen">;

type UploadState = "uploading" | "error" | "success";

export function PhotoUploadScreen({ route, navigation }: Props) {
  const { appointmentType } = route.params;
  // photos available: route.params.photos
  const [uploadState, setUploadState] = useState<UploadState>("uploading");

  const uploadPhotos = React.useCallback(async () => {
    try {
      // TODO: Implement actual photo upload logic
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Симуляция случайной ошибки для демонстрации
      const shouldFail = Math.random() > 0.7;

      if (shouldFail) {
        setUploadState("error");
      } else {
        setUploadState("success");
        // Navigate to success screen or home
        setTimeout(() => {
          navigation.navigate("Home");
        }, 1000);
      }
    } catch {
      setUploadState("error");
    }
  }, [navigation]);

  useEffect(() => {
    // Симуляция загрузки
    uploadPhotos();
  }, [uploadPhotos]);

  const handleRetry = () => {
    setUploadState("uploading");
    uploadPhotos();
  };

  return (
    <MainLayout
      title={appointmentType}
      onBackPress={() => navigation.goBack()}
      showBackButton={true}
      showFab={false}
    >
      <View style={styles.container}>
        {uploadState === "uploading" && (
          <>
            <View style={styles.iconContainer}>
              <BrainIcon />
            </View>

            <Text style={styles.title}>Анализ фотографий...</Text>
            <Text style={styles.subtitle}>Не закрывайте приложение</Text>

            <View style={styles.loaderContainer}>
              <LoaderIcon />
            </View>
          </>
        )}

        {uploadState === "error" && (
          <>
            <View style={styles.errorIconContainer}>
              <AlertCircle size={24} color="#D7131F" strokeWidth={2} />
            </View>

            <Text style={styles.errorText}>
              Не удалось загрузить фотографии. Проверьте подключение к
              интернету.
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                title="Повторить"
                onPress={handleRetry}
                variant="primary"
                textStyle={{ fontSize: 12 }}
                height={50}
              />
            </View>
          </>
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 25,
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginTop: 180,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#222221",
    textAlign: "center",
    letterSpacing: -0.54,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#616161",
    textAlign: "center",
    letterSpacing: -0.42,
    marginBottom: 40,
  },
  loaderContainer: {
    marginTop: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  errorIconContainer: {
    width: 24,
    height: 24,
    marginTop: 198,
    marginBottom: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#D7131F",
    textAlign: "center",
    letterSpacing: -0.48,
    lineHeight: 22,
    maxWidth: 276,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 80,
    left: 45,
    right: 45,
  },
});
