import { Appointment, AppointmentCard } from "@/src/entities/appointment";
import { Clock } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AppointmentListProps {
  appointments: Appointment[];
  onAppointmentPress?: (appointment: Appointment) => void;
  onArchivePress?: () => void;
  ListHeaderComponent?: React.ReactElement;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onAppointmentPress,
  onArchivePress,
  ListHeaderComponent,
  isRefreshing = false,
  onRefresh,
}) => {
  const renderHeader = () => (
    <>
      {ListHeaderComponent}
      <View style={styles.header}>
        <Text style={styles.title}>Ближайшие приемы</Text>
        <TouchableOpacity onPress={onArchivePress} style={styles.archiveButton}>
          <Clock size={16} color="#616161" />
          <Text style={styles.archiveText}>Архив</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isRefreshing ? "Загрузка приемов..." : "Приемы пока не назначены"}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={appointments}
      renderItem={({ item }) => (
        <AppointmentCard
          appointment={item}
          onPress={() => onAppointmentPress?.(item)}
        />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        appointments.length === 0 && styles.emptyList,
      ]}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  emptyList: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 35,
  },
  title: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#222221",
    letterSpacing: -0.54,
  },
  archiveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  archiveText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#616161",
    letterSpacing: -0.48,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#616161",
    textAlign: "center",
  },
});
