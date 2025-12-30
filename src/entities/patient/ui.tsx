import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Patient } from "./model";
import BellOffIcon from "@/shared/icons/BellOffIcon";

interface PatientCardProps {
  patient: Patient;
  onPress?: () => void;
}

// Определяет тип градиента карточки на основе заполненности данных
export type CardGradientType = "green" | "yellow" | "blue";

export function getCardGradientType(patient: Patient): CardGradientType {
  const hasFullName = !!(patient.firstName && patient.lastName);
  const hasPhone = !!patient.phone;
  const hasBirthDate = !!patient.birthDate;
  const hasImage = !!patient.imageUrl;

  // Зеленый = все данные заполнены
  if (hasFullName && hasPhone && hasBirthDate && hasImage) {
    return "green";
  }

  // Желтый = заполнены только ФИО и телефон
  if (hasFullName && hasPhone) {
    return "yellow";
  }

  // По умолчанию светло-голубой
  return "blue";
}

// Получает цвета градиента для типа карточки
export function getGradientColors(type: CardGradientType): string[] {
  switch (type) {
    case "green":
      // #12C089 с 30% прозрачности сверху, #12C089 снизу
      return ["rgba(18, 192, 137, 0.3)", "rgba(18, 192, 137, 1.0)"];
    case "yellow":
      // #A6C012 с 30% прозрачности сверху, #A6C012 снизу
      return ["rgba(166, 192, 18, 0.3)", "rgba(166, 192, 18, 1.0)"];
    case "blue":
      // По умолчанию светло-голубой
      return ["rgba(227, 242, 253, 0.3)", "rgba(227, 242, 253, 1.0)"];
    default:
      return ["rgba(227, 242, 253, 0.3)", "rgba(227, 242, 253, 1.0)"];
  }
}

// Форматирует дату рождения
export function formatBirthDate(date?: Date): string {
  if (!date) return "";
  const day = date.getDate();
  const months = [
    "янв",
    "фев",
    "мар",
    "апр",
    "май",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Форматирует полное имя
export function getFullName(patient: Patient): string {
  const parts = [
    patient.lastName,
    patient.firstName,
    patient.middleName,
  ].filter(Boolean);
  return parts.join(" ") || patient.firstName || "";
}

// Проверяет, нужно ли показывать дату удаления (2 года неактивности)
export function getDeletionDate(patient: Patient): Date | null {
  if (!patient.updatedAt) return null;
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  
  if (patient.updatedAt < twoYearsAgo) {
    const deletionDate = new Date(patient.updatedAt);
    deletionDate.setFullYear(deletionDate.getFullYear() + 2);
    return deletionDate;
  }
  
  return null;
}

// Форматирует дату удаления
export function formatDeletionDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onPress,
}) => {
  const gradientType = getCardGradientType(patient);
  const gradientColors = getGradientColors(gradientType);
  const fullName = getFullName(patient);
  const birthDateStr = formatBirthDate(patient.birthDate);
  const deletionDate = getDeletionDate(patient);
  const formattedPhone = patient.phone || "";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.imageContainer}>
            {patient.imageUrl ? (
              <Image
                source={
                  typeof patient.imageUrl === "number"
                    ? patient.imageUrl
                    : { uri: patient.imageUrl }
                }
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.headerRow}>
            <Text style={styles.name} numberOfLines={1}>
              {fullName}
            </Text>
            {patient.refuseReminders && (
              <View style={styles.bellIconContainer}>
                <BellOffIcon size={16} color="#d7131f" />
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            {birthDateStr ? (
              <Text style={styles.birthDate}>{birthDateStr}</Text>
            ) : (
              <View style={styles.emptySpace} />
            )}
            {formattedPhone ? (
              <Text style={styles.phone}>{formattedPhone}</Text>
            ) : null}
          </View>

          {deletionDate ? (
            <View style={styles.deletionRow}>
              <Text style={styles.deletionLabel}>
                Карточка будет удалена:
              </Text>
              <Text style={styles.deletionDate}>
                {formatDeletionDate(deletionDate)}
              </Text>
            </View>
          ) : (
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentLabel}>Ближайший прием:</Text>
              <Text style={styles.appointmentDate}>02.12.2025</Text>
            </View>
          )}
        </View>
      </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 10,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  gradient: {
    borderRadius: 12,
    padding: 12,
  },
  content: {
    flexDirection: "row",
  },
  leftSection: {
    marginRight: 12,
  },
  imageContainer: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E0E0E0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
  },
  rightSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#222221",
    letterSpacing: -0.48,
    flex: 1,
    marginRight: 8,
  },
  bellIconContainer: {
    marginLeft: "auto",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  birthDate: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#1F7876",
    letterSpacing: -0.36,
  },
  phone: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#222221",
    letterSpacing: -0.42,
    fontWeight: "600",
  },
  emptySpace: {
    flex: 1,
  },
  deletionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  deletionLabel: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#d7131f",
    letterSpacing: -0.36,
  },
  deletionDate: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#d7131f",
    letterSpacing: -0.36,
    fontWeight: "600",
  },
  appointmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  appointmentLabel: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#222221",
    letterSpacing: -0.36,
  },
  appointmentDate: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#222221",
    letterSpacing: -0.36,
    fontWeight: "600",
  },
});

