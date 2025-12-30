import {
  BottomNavigation,
  NavigationTab,
} from "@/src/widgets/bottom-navigation";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  showFab?: boolean;
  onFabPress?: () => void;
  headerRightElement?: React.ReactNode;
  onNotificationButtonLayout?: (x: number, y: number) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  onBackPress,
  showBackButton = true,
  showFab = true,
  onFabPress,
  headerRightElement,
  onNotificationButtonLayout,
}) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");

  const handleTabPress = (tab: NavigationTab) => {
    setActiveTab(tab);
    // Handle tab navigation
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title={title}
        onBackPress={onBackPress}
        showBackButton={showBackButton}
        rightElement={headerRightElement}
      />

      <View style={styles.content}>{children}</View>

      {showFab && (
        <TouchableOpacity
          style={styles.fab}
          onPress={onFabPress}
          activeOpacity={0.8}
        >
          <Plus size={28} color="#1F7876" strokeWidth={2.5} />
        </TouchableOpacity>
      )}

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
        notificationCount={14}
        onNotificationLayout={onNotificationButtonLayout}
      />
      {insets.bottom > 0 && (
        <View
          style={{
            height: insets.bottom,
            backgroundColor: "#FFFFFF",
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#F6F6F6",
  },
  content: {
    flex: 1,

    paddingHorizontal: 10,
  },
  fab: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bottom: 114,
    left: "50%",
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  fabGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
