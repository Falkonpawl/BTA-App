import { Patient } from "@/entities/patient"
import { PatientList } from "@/features/patient-list"
import { PatientSearch } from "@/features/patient-search"
import { PatientSort, SortOption } from "@/features/patient-sort"
import AddPatientIcon from "@/shared/icons/AddPatientIcon"
import React, { useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"

interface CartotekaScreenProps {
  patients: Patient[]
  isLoading?: boolean
  isRefreshing?: boolean
  onRefresh?: () => void
  onPatientPress?: (patient: Patient) => void
  onAddPatientPress?: () => void
}

export const CartotekaScreen: React.FC<CartotekaScreenProps> = ({
  patients,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  onPatientPress,
  onAddPatientPress,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("alphabet-asc")

  // Валидация поискового запроса
  const validateSearchQuery = (
    query: string
  ): { isValid: boolean; errorMessage?: string } => {
    // Проверка на длину
    if (query.length > 64) {
      return {
        isValid: false,
        errorMessage: "Строка поиска не может превышать длину в 64 символа",
      }
    }

    // Проверка на допустимые символы (только цифры и буквы)
    const invalidCharsRegex = /[^a-zA-Zа-яА-ЯёЁ0-9\s]/g
    if (query && invalidCharsRegex.test(query)) {
      return {
        isValid: false,
        errorMessage: "Строка поиска не может содержать символы",
      }
    }

    return { isValid: true }
  }

  const validation = validateSearchQuery(searchQuery)
  const hasSearchError = !validation.isValid && searchQuery.length > 0

  return (
    <>
      <View style={styles.container}>
        <PatientSearch
          value={searchQuery}
          onChangeText={setSearchQuery}
          error={hasSearchError}
        />
        <PatientList
          patients={patients}
          searchQuery={searchQuery}
          sortOption={sortOption}
          onPatientPress={onPatientPress}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
          searchError={hasSearchError ? validation.errorMessage : undefined}
          ListHeaderComponent={
            <PatientSort selectedOption={sortOption} onSelect={setSortOption} />
          }
        />
      </View>
      {onAddPatientPress && (
        <TouchableOpacity
          style={styles.customFab}
          onPress={onAddPatientPress}
          activeOpacity={0.8}
        >
          <AddPatientIcon size={84} />
        </TouchableOpacity>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  customFab: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
})
