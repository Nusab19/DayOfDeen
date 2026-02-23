import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-zinc-900">
      <Text className="text-3xl font-extrabold text-blue-400">DayOfDeen</Text>
      <Text className="text-base text-zinc-400 mt-2">NativeWind v4 is working perfectly!</Text>
      <StatusBar style="light" />
    </View>
  );
}
