import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightElement,
}) => {
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#222221" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 19,
    paddingBottom: 16,
    paddingHorizontal: 20,
    position: "relative",
    backgroundColor: "#F6F6F6",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 19,
    padding: 2,
  },
  title: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#222221",
    letterSpacing: -0.54,
  },
  rightElement: {
    position: "absolute",
    right: 20,
    top: 19,
  },
});
