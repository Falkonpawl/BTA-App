import { ModalScreenProps } from "@/shared/types/navigation";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = ModalScreenProps;

export function ModalPage({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is a modal</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F6F6F6",
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    color: "#222221",
    marginBottom: 20,
  },
  button: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#1BC4EA",
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
