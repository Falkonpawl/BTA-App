import { Button } from "@/shared/ui";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface ExitConfirmationModalProps {
  visible: boolean;
  onStay: () => void;
  onExit: () => void;
}

export function ExitConfirmationModal({
  visible,
  onStay,
  onExit,
}: ExitConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onStay}
    >
      <BlurView intensity={20} style={styles.modalOverlay} tint="dark">
        <View style={styles.exitModalContent}>
          <Text style={styles.exitModalText}>
            Все внесённые данные будут потеряны. Вы уверены, что хотите выйти?
          </Text>

          <Button
            title="ОСТАТЬСЯ"
            onPress={onStay}
            variant="primary"
            style={styles.exitModalButton}
            textStyle={styles.exitModalButtonText}
          />

          <Button
            title="Выйти"
            onPress={onExit}
            variant="gray"
            style={styles.exitModalButton}
            textStyle={styles.exitModalButtonText}
          />
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  exitModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: 310,
    alignItems: "center",
  },
  exitModalText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222221",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: "Montserrat",
  },
  exitModalButton: {
    width: 270,
    marginBottom: 12,
  },
  exitModalButtonText: {
    fontSize: 12,
    letterSpacing: -0.36,
  },
});
