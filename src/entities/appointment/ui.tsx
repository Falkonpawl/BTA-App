import { Badge } from "@/src/shared/ui";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Appointment,
  APPOINTMENT_TYPE_LABELS,
  APPOINTMENT_TYPE_VARIANTS,
} from "./model";

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
}) => {
  const formatDate = (date: Date, time: string) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return `Сегодня, ${time}`;
    }

    const day = date.getDate();
    const month = date.toLocaleDateString("ru-RU", { month: "short" });
    return `${day} ${month}, ${time}`;
  };

  const variant = APPOINTMENT_TYPE_VARIANTS[appointment.type];
  const label = APPOINTMENT_TYPE_LABELS[appointment.type];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {appointment.imageUrl ? (
          <Image
            source={{ uri: appointment.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {appointment.patientName}
        </Text>
        <Badge variant={variant}>{label}</Badge>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>
          {formatDate(appointment.date, appointment.time)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 55,
    height: 55,
    borderRadius: 14,
    overflow: "hidden",
    marginRight: 10,
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
  content: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#222221",
    letterSpacing: -0.42,
    marginBottom: 4,
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 8,
  },
  date: {
    fontFamily: "Montserrat-Medium",
    fontSize: 10,
    color: "#222221",
    letterSpacing: -0.3,
  },
});
