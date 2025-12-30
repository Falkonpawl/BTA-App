import { INJECTION_ZONES } from "@/features/injection-zones";
import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Check, Syringe } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<MainStackParamList, "SelectInjectionZones">;

export function SelectInjectionZonesScreen({ route, navigation }: Props) {
  const { appointmentType } = route.params;
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const toggleZone = (zoneId: string) => {
    setSelectedZones((prev) =>
      prev.includes(zoneId)
        ? prev.filter((id) => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  const handleContinue = () => {
    if (selectedZones.length === 0) return;

    // Navigate to camera screen to take photos first
    navigation.navigate("CameraScreen", {
      appointmentType,
      selectedZones,
      currentZoneIndex: 0,
    });
  };

  return (
    <MainLayout
      title="Первичный прием"
      onBackPress={() => navigation.goBack()}
      showBackButton={true}
      showFab={false}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Syringe size={26} color="#1BC4EA" />
          </View>
          <Text style={styles.title}>Выберите зоны инъецирования</Text>
          <Text style={styles.subtitle}>{appointmentType}</Text>
        </View>

        {/* Zones Grid */}
        <View style={styles.gridContainer}>
          {INJECTION_ZONES.map((zone, index) => {
            const isSelected = selectedZones.includes(zone.id);
            const isLeftColumn = index % 2 === 0;

            return (
              <TouchableOpacity
                key={zone.id}
                style={[
                  styles.zoneCard,
                  isLeftColumn ? styles.leftCard : styles.rightCard,
                ]}
                onPress={() => toggleZone(zone.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.cardContainer,
                    isSelected && styles.cardContainerSelected,
                  ]}
                >
                  <Image
                    source={zone.imageUrl}
                    style={styles.zoneImage}
                    resizeMode="cover"
                  />
                  {isSelected && (
                    <View style={styles.checkIconTop}>
                      <Check size={16} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.zoneLabel,
                      isSelected && styles.zoneLabelSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.zoneLabelText,
                        isSelected && styles.zoneLabelTextSelected,
                      ]}
                    >
                      {zone.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Подтвердить и продолжить"
            onPress={handleContinue}
            variant={selectedZones.length > 0 ? "primary" : "gray"}
            textStyle={{ fontSize: 14 }}
            height={60}
            disabled={selectedZones.length === 0}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  iconContainer: {
    width: 26,
    height: 26,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#222221",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
    letterSpacing: -0.48,
    marginBottom: 4,
  },
  subtitle: {
    color: "#838383",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
    letterSpacing: -0.42,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  zoneCard: {
    width: "50%",
    aspectRatio: 1.375,
    marginBottom: 10,
  },
  leftCard: {
    paddingRight: 5,
  },
  rightCard: {
    paddingLeft: 5,
  },
  cardContainer: {
    position: "relative",
    borderRadius: 18,
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  cardContainerSelected: {
    borderWidth: 3,
    borderColor: "#56B5B3",
  },
  zoneImage: {
    width: "100%",
    height: "100%",
  },
  checkIconTop: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#56B5B3",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  zoneLabel: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  zoneLabelSelected: {
    backgroundColor: "rgb(86, 181, 179, 0.8)",
  },
  zoneLabelText: {
    color: "#222221",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Montserrat-SemiBold",
    letterSpacing: -0.42,
    textAlign: "center",
    lineHeight: 18,
  },
  zoneLabelTextSelected: {
    color: "#FFFFFF",
  },
  buttonContainer: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
});
