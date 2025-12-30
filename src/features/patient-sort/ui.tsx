import { BlurView } from "expo-blur"
import { ChevronDown } from "lucide-react-native"
import React, { useRef, useState } from "react"
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { SortOption, SORT_OPTIONS, getSortLabel } from "./model"

interface PatientSortProps {
  selectedOption: SortOption
  onSelect: (option: SortOption) => void
}

export const PatientSort: React.FC<PatientSortProps> = ({
  selectedOption,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0 })
  const sortButtonRef = useRef<View>(null)

  const handleOpenModal = () => {
    sortButtonRef.current?.measureInWindow((x, y, width) => {
      setButtonLayout({ x, y, width })
      setModalVisible(true)
    })
  }

  const handleSelect = (option: SortOption) => {
    onSelect(option)
    setModalVisible(false)
  }

  return (
    <>
      <View ref={sortButtonRef} collapsable={false}>
        <TouchableOpacity
          style={styles.sortContainer}
          onPress={handleOpenModal}
          activeOpacity={0.7}
        >
          <Text style={styles.sortText}>{getSortLabel(selectedOption)}</Text>
          <View style={styles.sortIconContainer}>
            <ChevronDown size={11} color="#222221" />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <BlurView intensity={20} style={styles.modalOverlay} tint="dark">
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.sortModal,
                  {
                    top: buttonLayout.y + 25,
                    left: buttonLayout.x,
                  },
                ]}
              >
                <Text style={styles.sortModalTitle}>Сортировать карточки:</Text>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      selectedOption === option.value && styles.sortOptionActive,
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        selectedOption === option.value &&
                          styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
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
  },
  sortIconContainer: {
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
  },
  sortModal: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 280,
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sortModalTitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#222221",
    letterSpacing: -0.48,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortOptionActive: {
    backgroundColor: "#F5F5F5",
  },
  sortOptionText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#222221",
    letterSpacing: -0.42,
  },
  sortOptionTextActive: {
    color: "#1F7876",
    fontWeight: "600",
  },
})

