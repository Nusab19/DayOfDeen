import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", animation: "fade" }}
      />
      <Stack.Screen
        name="about"
        options={{ title: "About", animation: "fade" }}
      />
    </Stack>
  );
}
