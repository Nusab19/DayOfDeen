import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hmmm...</Text>
      <Text
        style={{
          color: "#76fad9ff",
          marginTop: 33,
          fontSize: 19,
          fontWeight: "700",
        }}
      >
        The first impression is not bad
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 33,
    fontWeight: "900",
    fontStyle: "italic",
  },
});
