import { Appointment } from "@/src/entities/appointment";
import { AppointmentList } from "@/src/features/appointment-list";
import { QuickActions, QuickActionType } from "@/src/features/quick-actions";
import React from "react";
import { StyleSheet, View } from "react-native";

interface HomeScreenProps {
  appointments: Appointment[];
  onAppointmentPress?: (appointment: Appointment) => void;
  onArchivePress?: () => void;
  onQuickActionPress?: (actionType: QuickActionType) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  appointments,
  onAppointmentPress,
  onArchivePress,
  onQuickActionPress,
  isRefreshing,
  onRefresh,
}) => {
  return (
    <View style={styles.container}>
      <AppointmentList
        appointments={appointments}
        onAppointmentPress={onAppointmentPress}
        onArchivePress={onArchivePress}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <QuickActions onActionPress={onQuickActionPress} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
});
