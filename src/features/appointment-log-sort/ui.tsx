import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  AppointmentLogSortOption,
  APPOINTMENT_LOG_SORT_OPTIONS,
  getAppointmentLogSortLabel,
} from "./model";

interface AppointmentLogSortProps {
  selectedOption: AppointmentLogSortOption;
  onSelect: (option: AppointmentLogSortOption) => void;
}

export const AppointmentLogSort: React.FC<AppointmentLogSortProps> = ({
  selectedOption,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0 });
  const sortButtonRef = useRef<View>(null);

  const handleOpenModal = () => {
    sortButtonRef.current?.measureInWindow((x, y, width) => {
      setButtonLayout({ x, y, width });
      setModalVisible(true);
    });
  };

  const handleSelect = (option: AppointmentLogSortOption) => {
    onSelect(option);
    setModalVisible(false);
  };

  return (
    <>
      <View ref={sortButtonRef} collapsable={false}>
        <TouchableOpacity
          style={styles.sortContainer}
          onPress={handleOpenModal}
          activeOpacity={0.7}
        >
          <Text style={styles.sortText}>
            {getAppointmentLogSortLabel(selectedOption)}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#424242" />
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
                <Text style={styles.sortModalTitle}>Сортировать приемы:</Text>
                {APPOINTMENT_LOG_SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      selectedOption === option.value &&
                        styles.sortOptionActive,
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
  );
};

const styles = StyleSheet.create({
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  sortText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#424242",
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
});

