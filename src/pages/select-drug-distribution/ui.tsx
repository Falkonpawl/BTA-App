import SyringeIcon from "@/shared/icons/SyringeIcon";
import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout, TextInput } from "@/shared/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<
  MainStackParamList,
  "SelectDrugDistribution"
>;

type DistributionOption = "separate" | "single";

export function SelectDrugDistributionScreen({ route, navigation }: Props) {
  const { appointmentType, selectedZones, photos } = route.params;
  const [selectedOption, setSelectedOption] =
    useState<DistributionOption | null>(null);
  const [drugName, setDrugName] = useState("");
  const [skipInFuture, setSkipInFuture] = useState(false);

  const handleConfirm = () => {
    if (!selectedOption) return;

    // Navigate to the appropriate dosage screen based on selection
    if (selectedOption === "single") {
      // Navigate to total dosage screen (one syringe with total dose)
      navigation.navigate("SelectTotalDosage", {
        appointmentType,
        selectedZones,
        photos,
        drugName,
      });
    } else {
      // Navigate to separate dosages screen (separate syringe per zone)
      navigation.navigate("SelectSeparateDosages", {
        appointmentType,
        selectedZones,
        photos,
        drugName,
      });
    }
  };

  // screenWidth available: Dimensions.get("window").width

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
        <Text style={styles.title}>
          Выберите вариант{"\n"}распределения препарата
        </Text>

        {/* Distribution options */}
        <View style={styles.optionsContainer}>
          {/* Separate syringe option */}
          <TouchableOpacity
            style={styles.optionCardWrapper}
            onPress={() => setSelectedOption("separate")}
            activeOpacity={0.7}
          >
            {selectedOption === "separate" ? (
              <LinearGradient
                colors={["#56B5B3", "#1F7876"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.optionCard}
              >
                <View style={styles.iconGrid}>
                  <LinearGradient
                    colors={["#F4F4F4", "#E2E2E2"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.smallSquare}
                  />
                  <LinearGradient
                    colors={["#F4F4F4", "#E2E2E2"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.smallSquare}
                  />
                  <LinearGradient
                    colors={["#F4F4F4", "#E2E2E2"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.smallSquare}
                  />
                  <LinearGradient
                    colors={["#F4F4F4", "#E2E2E2"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.smallSquare}
                  />
                </View>
                <Text style={[styles.optionText, styles.optionTextSelected]}>
                  Отдельный шприц на каждую зону
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.optionCard}>
                <View style={styles.iconGrid}>
                  <View style={styles.smallSquare} />
                  <View style={styles.smallSquare} />
                  <View style={styles.smallSquare} />
                  <View style={styles.smallSquare} />
                </View>
                <Text style={styles.optionText}>
                  Отдельный шприц на каждую зону
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Single syringe option */}
          <TouchableOpacity
            style={styles.optionCardWrapper}
            onPress={() => setSelectedOption("single")}
            activeOpacity={0.7}
          >
            {selectedOption === "single" ? (
              <LinearGradient
                colors={["#56B5B3", "#1F7876"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.optionCard}
              >
                <View style={styles.iconSingle}>
                  <LinearGradient
                    colors={["#F4F4F4", "#E2E2E2"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.bigSquare}
                  />
                </View>
                <Text style={[styles.optionText, styles.optionTextSelected]}>
                  Один шприц с общей дозой
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.optionCard}>
                <View style={styles.iconSingle}>
                  <View style={styles.bigSquare} />
                </View>
                <Text style={styles.optionText}>Один шприц с общей дозой</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Drug name input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Укажите название препарата"
            value={drugName}
            onChangeText={setDrugName}
            style={styles.input}
          />
        </View>

        {/* Info text */}
        <Text style={styles.infoText}>
          Препарат стандартно восстановленный (50ед на 1,0мл NaCl
          <Text style={styles.superscript}>2</Text> или 100ед на 2,0мл NaCl
          <Text style={styles.superscript}>2</Text>
          ), используются инсулиновые шприцы U100, 1,0мл, оранжевые, 1 деление =
          1 единица препарата.
        </Text>

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
            title="Продолжить"
            onPress={handleConfirm}
            disabled={!selectedOption}
            variant={selectedOption ? "primary" : "gray"}
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
    marginBottom: 16,
    lineHeight: 22,
  },
  optionsContainer: {
    paddingHorizontal: 48,
    gap: 10,
    marginBottom: 15,
  },
  optionCardWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    height: 85,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  iconGrid: {
    width: 32,
    height: 32,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  smallSquare: {
    width: 15,
    height: 15,
    backgroundColor: "#56B5B3",
    borderRadius: 3,
  },
  iconSingle: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  bigSquare: {
    width: 32,
    height: 32,
    backgroundColor: "#56B5B3",
    borderRadius: 10,
  },
  optionText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "400",
    color: "#222221",
    lineHeight: 20,
    flex: 1,
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
  inputContainer: {
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  input: {
    height: 50,
  },
  infoText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "400",
    color: "#222221",
    textAlign: "center",
    lineHeight: 20,
    marginHorizontal: 37,
    marginBottom: 18,
  },
  superscript: {
    fontSize: 8,
    fontWeight: "500",
    lineHeight: 10,
  },
  skipContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginBottom: 24,
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
});
