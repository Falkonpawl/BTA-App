import { BlurView } from "expo-blur";
import { CreditCard } from "lucide-react-native";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "./button";

interface SubscriptionModalProps {
  visible: boolean;
  onClose?: () => void;
  onPayPress?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  visible,
  onClose,
  onPayPress,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View style={styles.iconContainer}>
                <CreditCard size={32} color="#E5B800" />
              </View>

              <Text style={styles.title}>
                Бесплатный пробный период закончился. Оплатите подписку, чтобы
                пользоваться функциями приложения BTA Assist.
              </Text>

              <Button
                title="Перейти к оплате"
                style={styles.button}
                textStyle={{ fontSize: 12 }}
                onPress={onPayPress ?? (() => {})}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 35,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 28,
  },
  title: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#222221",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 35,
    letterSpacing: -0.3,
    maxWidth: 239,
  },
  button: {
    width: "100%",
  },
});
