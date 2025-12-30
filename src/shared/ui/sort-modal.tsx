import { BlurView } from "expo-blur";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export type SortOption =
  | "date-new"
  | "date-old"
  | "primary"
  | "checkup"
  | "repeat";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: SortOption) => void;
  selectedOption: SortOption;
  buttonPosition?: { x: number; y: number };
}

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedOption,
  buttonPosition,
}) => {
  const sortOptions = [
    { label: "По дате, новые", value: "date-new" as SortOption },
    { label: "По дате, старые", value: "date-old" as SortOption },
    { label: "Первичный прием", value: "primary" as SortOption },
    { label: "Осмотр, коррекция", value: "checkup" as SortOption },
    { label: "Повторный прием", value: "repeat" as SortOption },
  ];

  const handleSelect = (option: SortOption) => {
    onSelect(option);
    onClose();
  };

  const modalStyle = buttonPosition
    ? {
        position: "absolute" as const,
        top: buttonPosition.y + 20,
        left: buttonPosition.x,
      }
    : {};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={20} style={styles.overlay} tint="dark">
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, modalStyle]}>
              <Text style={styles.title}>Сортировать приемы:</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.optionButton}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOption === option.value && styles.selectedText,
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
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  modalContainer: {
    width: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingTop: 26,
    paddingBottom: 20,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    color: "#838383",
    letterSpacing: -0.36,
    marginBottom: 12,
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#222221",
    letterSpacing: -0.48,
    lineHeight: 25,
  },
  selectedText: {
    color: "#1F7876",
  },
});
