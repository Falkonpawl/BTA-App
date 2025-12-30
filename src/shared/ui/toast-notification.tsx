import { X } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { NotificationBubbleSvg } from "./notification-bubble-svg";

interface ToastNotificationProps {
  visible: boolean;
  avatarSource?: ImageSourcePropType;
  message: string;
  highlightedText?: string;
  actionText?: string;
  onActionPress?: () => void;
  onClose?: () => void;
  autoHideDuration?: number;
  anchorX?: number; // Координата X якорной точки (центр кнопки уведомлений)
  anchorY?: number; // Координата Y якорной точки (верх кнопки уведомлений)
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  avatarSource,
  message,
  highlightedText,
  actionText,
  onActionPress,
  onClose,
  autoHideDuration = 5000,
  anchorX,
  anchorY,
}) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoHideDuration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoHideDuration);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const renderMessage = () => {
    if (highlightedText && message.includes(highlightedText)) {
      const parts = message.split(highlightedText);
      return (
        <Text style={styles.messageText}>
          {parts[0]}
          <Text style={styles.highlightedText}>{highlightedText}</Text>
          {parts[1] || ""}
        </Text>
      );
    }
    return <Text style={styles.messageText}>{message}</Text>;
  };

  if (!visible) return null;

  const bubbleWidth = 312;
  const bubbleHeight = 150;

  if (anchorX === undefined || anchorY === undefined) {
    return null;
  }

  const bottomOffset = screenHeight - anchorY - 108;

  const containerStyle: any = {
    transform: [{ translateY: slideAnim }],
    opacity: opacityAnim,
    bottom: bottomOffset,
    left: anchorX - bubbleWidth / 1.53,
    top: undefined,
    right: undefined,
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.bubbleWrapper,
          { width: bubbleWidth, height: bubbleHeight },
        ]}
      >
        <View style={styles.svgBackground}>
          <NotificationBubbleSvg />
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={22} color="#222221" />
        </TouchableOpacity>
        <View style={styles.content}>
          {avatarSource && (
            <Image source={avatarSource} style={styles.avatar} />
          )}
          <View style={styles.textContainer}>
            {renderMessage()}
            {actionText && (
              <TouchableOpacity onPress={onActionPress}>
                <Text style={styles.actionText}>{actionText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000,
  },
  bubbleWrapper: {
    position: "relative",
  },
  svgBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: -10,
    zIndex: 2,
    backgroundColor: "transparent",
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 19,
    paddingLeft: 22,
  },
  avatar: {
    width: 55,
    height: 89,
    borderRadius: 14,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  messageText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 10,
    lineHeight: 14,
    color: "#222221",
    letterSpacing: -0.3,
    marginBottom: 16,
    paddingTop: 6,
  },
  highlightedText: {
    fontFamily: "Montserrat-Bold",
    fontWeight: "bold",
  },
  actionText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#1F7876",
    letterSpacing: -0.36,
    textDecorationLine: "underline",
    textAlign: "left",
  },
});
