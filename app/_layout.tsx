import { Stack } from "expo-router";

import "./global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: "Home", animation: "fade" }}
      />
      {/* It's not needed tho. We're not gonna use it actually */}
      {/* But we'll see */}
      {/* <PortalHost /> */}
    </Stack>
  );
}
