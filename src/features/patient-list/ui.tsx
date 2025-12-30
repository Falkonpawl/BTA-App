import { Patient, PatientCard, getFullName } from "@/entities/patient"
import React from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { SortOption } from "../patient-sort"

interface PatientListProps {
  patients: Patient[]
  searchQuery: string
  sortOption: SortOption
  onPatientPress?: (patient: Patient) => void
  isLoading?: boolean
  isRefreshing?: boolean
  onRefresh?: () => void
  searchError?: string
  ListHeaderComponent?: React.ReactElement
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  searchQuery,
  sortOption,
  onPatientPress,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  searchError,
  ListHeaderComponent,
}) => {
  // Filter and sort patients
  const filteredAndSortedPatients = React.useMemo(() => {
    let filtered = [...patients]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((patient) => {
        const fullName = getFullName(patient).toLowerCase()
        const phone = patient.phone?.toLowerCase() || ""
        return fullName.includes(query) || phone.includes(query)
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "alphabet-asc": {
          const nameA = getFullName(a).toLowerCase()
          const nameB = getFullName(b).toLowerCase()
          return nameA.localeCompare(nameB, "ru")
        }
        case "alphabet-desc": {
          const nameA = getFullName(a).toLowerCase()
          const nameB = getFullName(b).toLowerCase()
          return nameB.localeCompare(nameA, "ru")
        }
        case "nearest-appointment":
          // TODO: Sort by nearest appointment date when available
          return 0
        case "registration-new":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "registration-old":
          return a.createdAt.getTime() - b.createdAt.getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [patients, searchQuery, sortOption])

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isLoading
          ? "Загрузка картотеки..."
          : searchError
          ? searchError
          : searchQuery.trim()
          ? "По вашему запросу пациенты не найдены"
          : "Картотека пока что пуста"}
      </Text>
    </View>
  )

  return (
    <FlatList
      data={filteredAndSortedPatients}
      renderItem={({ item }) => (
        <PatientCard patient={item} onPress={() => onPatientPress?.(item)} />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContainer,
        filteredAndSortedPatients.length === 0 && styles.emptyListContainer,
      ]}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={renderEmptyState}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 10,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#D7131F",
    letterSpacing: -0.42,
    textAlign: "center",
    paddingHorizontal: 30,
  },
})
