import { TabScreenProps } from "@/shared/types/navigation";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = TabScreenProps<"Explore">;

export function ExplorePage({ navigation }: Props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature-Sliced Design</Text>
          <Text style={styles.text}>
            This app uses Feature-Sliced Design architecture.
          </Text>
          <Text style={styles.text}>
            The structure includes app, pages, widgets, features, entities, and
            shared layers.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Support</Text>
          <Text style={styles.text}>
            You can open this project on Android, iOS, and the web.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#D0D0D0",
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 32,
    color: "#222221",
  },
  content: {
    padding: 20,
    gap: 20,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: 18,
    color: "#222221",
    marginBottom: 8,
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#616161",
    lineHeight: 20,
  },
});
