import SyringeIcon from "@/shared/icons/SyringeIcon";
import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import DozaEllipseIcon from "@/src/shared/icons/DozaEllipseIcon";
import SyringeDozaIcon from "@/src/shared/icons/SyringeDozaIcon";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "SelectTotalDosage">;

export function SelectTotalDosageScreen({ route, navigation }: Props) {
  const { appointmentType, selectedZones, photos } = route.params;
  // drugName available: route.params.drugName
  // totalDosage and setTotalDosage available but unused
  // const [totalDosage, setTotalDosage] = useState(0);
  const [skipInFuture, setSkipInFuture] = useState(false);

  // handleDosageChange available but unused
  // const handleDosageChange = (increment: boolean) => {
  //   if (increment) {
  //     setTotalDosage((prev) => prev + 1);
  //   } else {
  //     setTotalDosage((prev) => Math.max(0, prev - 1));
  //   }
  // };

  const handleConfirm = () => {
    // Navigate to injection points marking
    navigation.navigate("InjectionPoints", {
      appointmentType,
      selectedZones,
      photos,
      currentZoneIndex: 0,
    });
  };

  // screenWidth and screenHeight available: Dimensions.get("window")

  return (
    <MainLayout
      title="Первичный прием"
      onBackPress={() => navigation.goBack()}
      showFab={false}
    >
      <View style={styles.container}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <SyringeIcon />
        </View>

        {/* Title */}
        <Text style={styles.title}>Один шприц с общей дозой</Text>

        {/* Syringe Visualization */}
        <View style={styles.syringeContainer}>
          <View style={styles.syringeCircle}>
            <View style={styles.syringeWrapper}>
              <View style={{ position: "absolute", top: 0, left: 0 }}>
                <DozaEllipseIcon />
              </View>
              <SyringeDozaIcon />
            </View>
            {/* Dosage Badge */}
            <View style={styles.dosageBadge}>
              <Text style={styles.dosageText}>
                {totalDosage} <Text style={styles.dosageUnit}>ед.</Text>
              </Text>
            </View>
          </View>
        </View>

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

        {/* Confirm button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Начать процедуру"
            onPress={handleConfirm}
            variant="primary"
            textStyle={{ fontSize: 14 }}
            height={60}
          />
        </View>

        {/* Help text */}
        <Text style={styles.helpText}>Требуется помощь?</Text>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "500",
    color: "#222221",
    textAlign: "center",
    marginHorizontal: 52,
    marginBottom: 20,
    lineHeight: 22,
  },
  syringeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  syringeCircle: {
    width: 229,
    height: 229,
    borderRadius: 114.5,
    backgroundColor: "rgba(162, 237, 213, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  syringeWrapper: {
    width: 236,
    height: 236,
  },
  dosageBadge: {
    position: "absolute",
    bottom: 45,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F7876",
    justifyContent: "center",
    alignItems: "center",
  },
  dosageText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  dosageUnit: {
    fontSize: 10,
  },
  dosageControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
    paddingHorizontal: 30,
  },
  dosageButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#56B5B3",
    justifyContent: "center",
    alignItems: "center",
  },
  dosageButtonText: {
    fontFamily: "Montserrat",
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dosageDisplay: {
    fontFamily: "Montserrat",
    fontSize: 32,
    fontWeight: "600",
    color: "#222221",
    minWidth: 60,
    textAlign: "center",
  },
  skipContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
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
});
