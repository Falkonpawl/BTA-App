import {
  APPOINTMENT_TYPES,
  OTHER_OPTION,
  type AppointmentTypeOption,
} from "@/features/appointment-type-selection";
import { MainStackParamList } from "@/shared/types/navigation";
import { MainLayout } from "@/shared/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Syringe } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<
  MainStackParamList,
  "SelectAppointmentType"
>;

export function SelectAppointmentTypeScreen({ navigation }: Props) {
  const [selectedType, setSelectedType] = useState<AppointmentTypeOption>(
    "Ботулотоксин типа А"
  );
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Анимация поворота стрелки
    Animated.timing(rotateAnim, {
      toValue: showOtherOptions ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Анимация высоты списка
    Animated.timing(heightAnim, {
      toValue: showOtherOptions ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showOtherOptions, heightAnim, rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handleSelectType = (type: AppointmentTypeOption) => {
    if (type === OTHER_OPTION) {
      setShowOtherOptions(!showOtherOptions);
    } else {
      setSelectedType(type);
      setShowOtherOptions(false);
      // Navigate to injection zones selection
      navigation.navigate("SelectInjectionZones", { appointmentType: type });
    }
  };

  // Получаем список доступных опций (все кроме выбранной)
  const getAvailableOptions = (): AppointmentTypeOption[] => {
    const allTypes: AppointmentTypeOption[] = [
      "Ботулотоксин типа А",
      ...APPOINTMENT_TYPES,
    ];
    return allTypes.filter((type) => type !== selectedType);
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
        {/* Icon and Title Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Syringe size={26} color="#1BC4EA" />
          </View>
          <Text style={styles.subtitle}>Выберите тип приема</Text>
        </View>

        {/* Appointment Types List */}
        <View style={styles.listContainer}>
          <View style={styles.topDivider} />

          {/* Selected Type - всегда показывается первым */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {}}
            activeOpacity={1}
          >
            <Text style={[styles.listItemText, styles.listItemTextSelected]}>
              {selectedType}
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />

          {/* Other with dropdown */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleSelectType(OTHER_OPTION)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.listItemText,
                showOtherOptions && { color: "#222221" },
              ]}
            >
              {OTHER_OPTION}
            </Text>
            <Animated.View
              style={[
                styles.chevron,
                { transform: [{ rotate: rotateInterpolate }] },
              ]}
            >
              <Text style={styles.chevronText}>▼</Text>
            </Animated.View>
          </TouchableOpacity>
          <View style={styles.divider} />

          {/* Expanded options when "Other" is selected */}
          {getAvailableOptions().map((type, index) => {
            const itemHeight = heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 58], // примерная высота одного пункта
            });

            const opacity = heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            });

            return (
              <Animated.View
                key={`option-${type}-${index}`}
                style={{
                  height: itemHeight,
                  opacity: opacity,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handleSelectType(type)}
                  activeOpacity={0.7}
                  disabled={!showOtherOptions}
                >
                  <Text style={[styles.listItemText, { color: "#222221" }]}>
                    {type}
                  </Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </Animated.View>
            );
          })}
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
    flexGrow: 1,
  },
  headerSection: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 108,
  },
  iconContainer: {
    width: 26,
    height: 26,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    color: "#222221",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
    letterSpacing: -0.48,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  topDivider: {
    height: 1,
    backgroundColor: "#C3C3C3",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16.5,
    paddingHorizontal: 15,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Montserrat-Medium",
    color: "#838383",
    letterSpacing: -0.54,
    flex: 1,
  },
  listItemTextGray: {
    color: "#838383",
  },
  listItemTextSelected: {
    color: "#222221",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#C3C3C3",
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 11,
    color: "#838383",
  },
});
