import BookIcon from "@/src/shared/icons/BookIcon";
import CalendarIcon from "@/src/shared/icons/CalendarIcon";
import CartotekaIcon from "@/src/shared/icons/CartotekaIcon";
import EyeIcon from "@/src/shared/icons/EyeIcon";
import FaceIcon from "@/src/shared/icons/FaceIcon";
import SyringeIcon from "@/src/shared/icons/SyringeIcon";
import { IconButton } from "@/src/shared/ui";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type QuickActionType =
  | "primary-appointment"
  | "checkup"
  | "repeat-appointment"
  | "calendar"
  | "files"
  | "education";

interface QuickAction {
  id: QuickActionType;
  label: string;
  icon: React.ReactNode;
}

interface QuickActionsProps {
  onActionPress?: (actionType: QuickActionType) => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "primary-appointment",
    label: "Первичный приём",
    icon: <SyringeIcon />,
  },
  {
    id: "checkup",
    label: "Осмотр, коррекция",
    icon: <EyeIcon />,
  },
  {
    id: "repeat-appointment",
    label: "Повторный приём",
    icon: <FaceIcon />,
  },
  {
    id: "calendar",
    label: "Мой календарь",
    icon: <CalendarIcon />,
  },
  {
    id: "files",
    label: "Картотека",
    icon: <CartotekaIcon />,
  },
  {
    id: "education",
    label: "Учебное пособие",
    icon: <BookIcon />,
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({
  onActionPress,
}) => {
  return (
    <View className="mb-5">
      <View style={styles.gridContainer}>
        {QUICK_ACTIONS.map((action) => (
          <View key={action.id} style={styles.gridItem}>
            <IconButton onPress={() => onActionPress?.(action.id)} size={107}>
              <View style={styles.cardContent}>
                {action.icon}
                <Text style={styles.cardText}>{action.label}</Text>
              </View>
            </IconButton>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    width: "31%",
    alignItems: "center",
    marginBottom: 8,
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cardText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
    textAlign: "center",
    maxWidth: 90,
    lineHeight: 14,
  },
});
