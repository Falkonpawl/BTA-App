import { usePerformerArchiveDrives } from "@/shared/api";
import {
  Appointment,
  AppointmentCard,
  driveToAppointment,
} from "@/src/entities/appointment";
import { mockArchivedAppointments } from "@/src/shared/lib/mock-data";
import { MainStackScreenProps } from "@/src/shared/types/navigation";
import { MainLayout, SortModal, SortOption } from "@/src/shared/ui";
import { ChevronDown } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ArchiveScreenProps = MainStackScreenProps<"Archive">;

export const ArchiveScreen: React.FC<ArchiveScreenProps> = ({ navigation }) => {
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>("date-new");
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const sortButtonRef = useRef<View>(null);

  // Fetch performer's archive appointments
  const performerArchive = usePerformerArchiveDrives();

  // Convert API drives to appointments
  const archivedAppointments = useMemo(() => {
    const drivesData = performerArchive.data?.data;

    if (drivesData && Array.isArray(drivesData)) {
      console.log("📁 Converting archive drives to appointments:", drivesData);
      return drivesData.map(driveToAppointment);
    }

    // Fallback to mock data if API data not available
    console.log("⚠️ Using mock archive appointments (API data not available)");
    return mockArchivedAppointments;
  }, [performerArchive.data]);

  // Sort archived appointments based on selected sort option
  const sortedAppointments = useMemo(() => {
    if (!archivedAppointments) return [];

    const sorted = [...archivedAppointments];

    switch (selectedSort) {
      case "date-new":
        return sorted.sort((a, b) => b.date.getTime() - a.date.getTime());
      case "date-old":
        return sorted.sort((a, b) => a.date.getTime() - b.date.getTime());
      case "primary":
        return sorted.filter((a) => a.type === "primary");
      case "checkup":
        return sorted.filter((a) => a.type === "checkup");
      case "repeat":
        return sorted.filter((a) => a.type === "repeat");
      default:
        return sorted;
    }
  }, [archivedAppointments, selectedSort]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    navigation.navigate("AppointmentDetail", { appointmentId: appointment.id });
  };

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option);
  };

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "date-new":
        return "Новые";
      case "date-old":
        return "Старые";
      case "primary":
        return "Первичный прием";
      case "checkup":
        return "Осмотр, коррекция";
      case "repeat":
        return "Повторный прием";
      default:
        return "Новые";
    }
  };

  const renderSortFilter = () => (
    <View ref={sortButtonRef} collapsable={false}>
      <TouchableOpacity
        style={styles.sortContainer}
        onPress={() => {
          sortButtonRef.current?.measureInWindow((x, y) => {
            setButtonPosition({ x, y });
            setSortModalVisible(true);
          });
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.sortText}>{getSortLabel(selectedSort)}</Text>
        <ChevronDown size={11} color="#222221" style={styles.sortIcon} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {performerArchive.isLoading
          ? "Загрузка архива..."
          : "Архив приемов пока что пуст"}
      </Text>
    </View>
  );

  return (
    <MainLayout
      title="Архив"
      onBackPress={handleBackPress}
      showBackButton={true}
      showFab={false}
    >
      <FlatList
        data={sortedAppointments}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onPress={() => handleAppointmentPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          sortedAppointments.length === 0 && styles.emptyListContainer,
        ]}
        ListHeaderComponent={renderSortFilter}
        ListEmptyComponent={renderEmptyState}
        refreshing={performerArchive.isRefetching}
        onRefresh={() => performerArchive.refetch()}
      />

      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        onSelect={handleSortSelect}
        selectedOption={selectedSort}
        buttonPosition={buttonPosition}
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  sortText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#222221",
    letterSpacing: -0.36,
    marginRight: 4,
  },
  sortIcon: {
    transform: [{ rotate: "180deg" }],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#838383",
    letterSpacing: -0.42,
    textAlign: "center",
  },
});
