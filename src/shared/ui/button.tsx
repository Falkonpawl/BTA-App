import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "gray";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientStyle?: ViewStyle;
  height?: number;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  gradientStyle,
  height,
}: ButtonProps) {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
        };
      case "large":
        return {
          paddingVertical: 18,
          paddingHorizontal: 32,
          fontSize: 16,
        };
      default:
        return {
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const buttonHeight = height || sizeStyles.height;

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.buttonContainer, { opacity: disabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={["#56B5B3", "#1F7876"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.gradient,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              height: buttonHeight,
            },
            gradientStyle,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text
              style={[
                styles.primaryText,
                { fontSize: sizeStyles.fontSize },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === "gray") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.buttonContainer, { opacity: disabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={["#f4f4f4", "#e2e2e2"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.gradient,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              height: buttonHeight,
            },
            gradientStyle,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#3d3d3d" size="small" />
          ) : (
            <Text
              style={[
                styles.grayText,
                { fontSize: sizeStyles.fontSize },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === "outline") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.outlineButton,
          {
            height: buttonHeight,
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#1F7876" size="small" />
        ) : (
          <Text
            style={[
              styles.outlineText,
              { fontSize: sizeStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  // Secondary variant
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.secondaryButton,
        {
          height: buttonHeight,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#1F7876" size="small" />
      ) : (
        <Text
          style={[
            styles.secondaryText,
            { fontSize: sizeStyles.fontSize },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 64,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  gradient: {
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.36,
  },
  grayText: {
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
    color: "#7c7c7c",
    textAlign: "center",
    letterSpacing: -0.36,
  },
  outlineButton: {
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "#1F7876",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  outlineText: {
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
    color: "#1F7876",
    textAlign: "center",
    letterSpacing: -0.36,
  },
  secondaryButton: {
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5F5",
  },
  secondaryText: {
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
    color: "#1F7876",
    textAlign: "center",
    letterSpacing: -0.36,
  },
});
