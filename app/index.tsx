import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="bg-secondary h-full w-full flex items-center justify-center">
      <Text className="text-sky-400 italic text-4xl font-bold my-5">
        Hmmm...
      </Text>
      <Text className="text-sky-900 tracking-wider font-mono">
        The first impression is not bad
      </Text>
    </View>
  );
}
