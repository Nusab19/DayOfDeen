import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function About() {
  return (
    <View className="flex-1 items-center justify-center bg-accent">
      <Text className="text-purple-900 text-7xl font-semibold">About Page</Text>

      <Link
        href="/"
        className="bg-emerald-600 text-white font-semibold p-2 rounded-md -pt-0.5 mt-10 hover:bg-emerald-700"
      >
        Go Home kid
      </Link>
    </View>
  );
}
