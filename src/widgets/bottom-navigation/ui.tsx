import BellIcon from "@/src/shared/icons/BellIcon";
import HomeIcon from "@/src/shared/icons/HomeIcon";
import SettingsIcon from "@/src/shared/icons/SettingsIcon";
import UserIcon from "@/src/shared/icons/UserIcon";
import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type NavigationTab = "home" | "settings" | "notifications" | "profile";

interface BottomNavigationProps {
  activeTab?: NavigationTab;
  onTabPress?: (tab: NavigationTab) => void;
  notificationCount?: number;
  onNotificationLayout?: (x: number, y: number) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = "home",
  onTabPress,
  notificationCount = 0,
  onNotificationLayout,
}) => {
  const notificationRef = useRef<View>(null);

  const getIconColor = (tab: NavigationTab) =>
    activeTab === tab ? "#1BC4EA" : "#9E9E9E";

  const handleNotificationLayout = () => {
    if (notificationRef.current) {
      notificationRef.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          onNotificationLayout?.(pageX + width / 2, pageY);
        }
      );
    }
  };

  return (
    <View style={styles.container} className="flex items-center justify-center">
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onTabPress?.("home")}
          activeOpacity={0.7}
        >
          <HomeIcon size={24} color={getIconColor("home")} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onTabPress?.("settings")}
          activeOpacity={0.7}
        >
          <SettingsIcon size={24} color={getIconColor("settings")} />
        </TouchableOpacity>
        <TouchableOpacity
          ref={notificationRef}
          style={styles.tab}
          onPress={() => onTabPress?.("notifications")}
          activeOpacity={0.7}
          onLayout={handleNotificationLayout}
        >
          <BellIcon size={24} color={getIconColor("notifications")} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onTabPress?.("profile")}
          activeOpacity={0.7}
        >
          <UserIcon size={24} color={getIconColor("profile")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: "#000",
    height: 54,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tab: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -2,
    backgroundColor: "#D7131F",
    borderRadius: 99,
    minWidth: 21,
    height: 21,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 10,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.3,
  },
});
