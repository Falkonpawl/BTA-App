import { MainStackScreenProps } from "@/shared/types/navigation";
import { MainLayout } from "@/shared/ui";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type CartotekaScreenProps = MainStackScreenProps<"Cartoteka">;

export const CartotekaScreen: React.FC<CartotekaScreenProps> = ({
  navigation,
}) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <MainLayout
      title="Картотека"
      onBackPress={handleBackPress}
      showBackButton={true}
      showFab={false}
    >
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Картотека</Text>
          <Text style={styles.emptySubtext}>
            Здесь будет отображаться картотека пациентов
          </Text>
        </View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#222221",
    letterSpacing: -0.54,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#838383",
    letterSpacing: -0.42,
    textAlign: "center",
  },
});

