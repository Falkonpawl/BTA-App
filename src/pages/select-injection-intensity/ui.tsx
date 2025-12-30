import { INJECTION_ZONES } from "@/features/injection-zones";
import { MainStackParamList } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Check } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

type Props = NativeStackScreenProps<
  MainStackParamList,
  "SelectInjectionIntensity"
>;

type IntensityOption = "light" | "strong";

interface IntensityCardData {
  id: IntensityOption;
  label: string;
}

const INTENSITY_OPTIONS: IntensityCardData[] = [
  { id: "light", label: "Полегче" },
  { id: "strong", label: "Посильнее" },
];

export function SelectInjectionIntensityScreen({ route, navigation }: Props) {
  const { appointmentType, selectedZones, photos, currentZoneIndex } =
    route.params;
  const [selectedIntensity, setSelectedIntensity] =
    useState<IntensityOption | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [zoneIntensities, setZoneIntensities] = useState<
    Record<string, IntensityOption>
  >({});

  const currentZone = INJECTION_ZONES.find(
    (z) => z.id === selectedZones[currentZoneIndex]
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleIntensitySelect = (intensity: IntensityOption) => {
    setSelectedIntensity(intensity);
  };

  const handleConfirm = () => {
    if (!selectedIntensity || !currentZone) return;

    // Save the intensity for the current zone
    const updatedIntensities = {
      ...zoneIntensities,
      [currentZone.id]: selectedIntensity,
    };
    setZoneIntensities(updatedIntensities);

    if (currentZoneIndex < selectedZones.length - 1) {
      // Move to next zone
      navigation.push("SelectInjectionIntensity", {
        appointmentType,
        selectedZones,
        photos,
        currentZoneIndex: currentZoneIndex + 1,
      });
      setSelectedIntensity(null);
    } else {
      // All intensities selected, navigate to photo upload screen
      navigation.navigate("PhotoUploadScreen", {
        appointmentType,
        photos,
      });
    }
  };

  if (!currentZone) {
    return null;
  }

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Адаптивные размеры относительно экрана
  const CARD_WIDTH = screenWidth - 96; // 48px отступ с каждой стороны (как в дизайне)
  const CARD_SPACING = 20;
  const SIDE_OFFSET = 48; // Отступ от краев экрана

  // Высота карточки: от верха (badge + title) до кнопки
  // badge (34px) + marginTop (10px) + marginBottom (15px) = 59px
  // title (22px line height * 2 lines) + marginBottom (30px) = 74px
  // button container (60px button + 40px padding) = 100px
  // Итого занято: ~233px, остаток - для карточки
  const CARD_HEIGHT = screenHeight - 460; // Адаптивная высота

  // Find the photo for the current zone
  const currentZonePhoto = photos.find((p) => p.zoneId === currentZone.id);

  const getItemLayout = (_: any, index: number) => ({
    length: CARD_WIDTH + CARD_SPACING,
    offset: (CARD_WIDTH + CARD_SPACING) * index,
    index,
  });

  const renderIntensityCard = ({
    item,
    index,
  }: {
    item: IntensityCardData;
    index: number;
  }) => {
    const isSelected = selectedIntensity === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.intensityCard,
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            marginHorizontal: CARD_SPACING / 2,
          },
          isSelected && styles.intensityCardSelected,
        ]}
        onPress={() => handleIntensitySelect(item.id)}
        activeOpacity={0.9}
      >
        <Image
          source={
            currentZonePhoto
              ? { uri: currentZonePhoto.uri }
              : currentZone.imageUrl
          }
          style={styles.intensityImage}
          resizeMode="cover"
        />
        <View
          style={[
            styles.intensityLabel,
            isSelected && styles.intensityLabelSelected,
          ]}
        >
          <Text
            style={[
              styles.intensityLabelText,
              isSelected && styles.intensityLabelTextSelected,
            ]}
          >
            {item.label}
          </Text>
        </View>

        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Check size={16} color="#FFFFFF" strokeWidth={3} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <MainLayout
      title="Первичный прием"
      onBackPress={() => navigation.goBack()}
      showFab={false}
    >
      <View style={styles.container}>
        {/* Zone indicator badge */}
        <View style={styles.zoneBadge}>
          <Text style={styles.zoneBadgeNumber}>{currentZoneIndex + 1}</Text>
          <Text style={styles.zoneBadgeText}>{currentZone.name}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Выберите вариант{"\n"}интенсивности инъекции
        </Text>

        {/* Intensity swiper */}
        <View style={styles.swiperContainer}>
          <FlatList
            ref={flatListRef}
            data={INTENSITY_OPTIONS}
            renderItem={renderIntensityCard}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: SIDE_OFFSET - CARD_SPACING / 2,
              alignItems: "center",
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={getItemLayout}
          />
        </View>

        {/* Confirm button */}
        <View style={styles.buttonContainer}>
          <Button
            title={
              selectedIntensity && currentZoneIndex === selectedZones.length - 1
                ? "Выбрать дозировку"
                : "Подтвердить и продолжить"
            }
            onPress={handleConfirm}
            disabled={!selectedIntensity}
            variant={selectedIntensity ? "primary" : "gray"}
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
  },
  zoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(86, 181, 179, 1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 38,
    marginTop: 10,
    marginBottom: 15,
  },
  zoneBadgeNumber: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    position: "absolute",
    left: 16,
  },
  zoneBadgeText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "500",
    color: "#222221",
    textAlign: "center",
    marginHorizontal: 52,
    marginBottom: 30,
    lineHeight: 22,
  },
  swiperContainer: {
    flex: 1,
    justifyContent: "center",
  },
  intensityCard: {
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  intensityCardSelected: {
    borderWidth: 3,
    borderColor: "#56B5B3",
  },
  intensityImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  intensityLabel: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 21,
    paddingVertical: 10,
    alignItems: "center",
  },
  intensityLabelSelected: {
    backgroundColor: "rgba(86, 181, 179, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 28,
  },
  intensityLabelText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "500",
    color: "#222221",
  },
  intensityLabelTextSelected: {
    color: "#FFFFFF",
  },
  checkmarkContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#56B5B3",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: "#F6F6F6",
  },
  button: {
    width: "100%",
  },
});
