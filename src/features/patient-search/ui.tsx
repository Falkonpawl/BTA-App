import { TextInput } from "@/shared/ui"
import { Search } from "lucide-react-native"
import React from "react"
import { StyleSheet, View } from "react-native"

interface PatientSearchProps {
  value: string
  onChangeText: (text: string) => void
  error?: boolean
}

export const PatientSearch: React.FC<PatientSearchProps> = ({
  value,
  onChangeText,
  error = false,
}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <TextInput
          placeholder="Поиск"
          value={value}
          onChangeText={onChangeText}
          style={styles.searchInput}
          containerStyle={styles.searchInputWrapper}
          error={error}
        />
        <View style={styles.searchIconContainer}>
          <Search size={20} color="#838383" />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  searchInputContainer: {
    position: "relative",
  },
  searchInputWrapper: {
    paddingRight: 45,
  },
  searchInput: {
    paddingRight: 10,
  },
  searchIconContainer: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
})

