import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "AppointmentSuccess">;

export function AppointmentSuccessScreen({ navigation }: Props) {
  const handleOk = () => {
    navigation.navigate("Home");
  };

  return (
    <MainLayout
      title="Первичный прием"
      onBackPress={() => navigation.navigate("Home")}
      showFab={false}
    >
      <View style={styles.container}>
        {/* Success Content */}
        <View style={styles.successContent}>
          {/* Checkmark */}
          <View style={styles.checkmarkWrapper}>
            <Text style={styles.checkmark}>✓</Text>
          </View>

          {/* Success Message */}
          <Text style={styles.successMessage}>Прием пациента{"\n"}окончен</Text>
        </View>

        {/* OK Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Ок"
            onPress={handleOk}
            variant="primary"
            textStyle={{ fontSize: 14 }}
            height={60}
          />
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    justifyContent: "space-between",
  },
  successContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  checkmarkWrapper: {
    marginBottom: 10,
  },
  checkmark: {
    fontSize: 16,
    color: "#56B5B3",
    fontWeight: "600",
  },
  successMessage: {
    fontFamily: "Montserrat",
    fontSize: 20,
    fontWeight: "500",
    color: "#222221",
    textAlign: "center",
    lineHeight: 28,
  },
  buttonContainer: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    backgroundColor: "#F6F6F6",
  },
});
