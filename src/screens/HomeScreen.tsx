import { Appointment } from "@/src/entities/appointment";
import { QuickActionType } from "@/src/features/quick-actions";
import { mockAppointments } from "@/src/shared/lib/mock-data";
import { MainStackScreenProps } from "@/src/shared/types/navigation";
import { MainLayout } from "@/src/shared/ui";
import { HomeScreen as HomeScreenWidget } from "@/src/widgets/home-screen";
import React, { useState } from "react";

type Props = MainStackScreenProps<"Home">;

export default function HomeScreen({ navigation }: Props) {
  const [appointments] = useState<Appointment[]>(mockAppointments);

  const handleAppointmentPress = (appointment: Appointment) => {
    console.log("Appointment pressed:", appointment);
    // Navigate to appointment details
  };

  const handleArchivePress = () => {
    console.log("Archive pressed");
    // Navigate to archive
  };

  const handleQuickActionPress = (actionType: QuickActionType) => {
    console.log("Quick action pressed:", actionType);
    // Handle quick action
  };

  const handleBackPress = () => {
    console.log("Back pressed");
    navigation.goBack();
  };

  const handleAddPress = () => {
    console.log("Add button pressed");
    // Handle add action
  };

  return (
    <MainLayout
      title="BTA Assist"
      onBackPress={handleBackPress}
      showBackButton={true}
      showFab={true}
      onFabPress={handleAddPress}
    >
      <HomeScreenWidget
        appointments={appointments}
        onAppointmentPress={handleAppointmentPress}
        onArchivePress={handleArchivePress}
        onQuickActionPress={handleQuickActionPress}
      />
    </MainLayout>
  );
}
