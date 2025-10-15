import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="bg-gray-900 h-full w-full flex items-center justify-center">
      <Text className="text-sky-400 italic text-4xl font-bold my-5">
        Hmmm...
      </Text>
      <Text className="text-sky-100 tracking-wider font-mono">
        The first impression is not bad
      </Text>

      <Link
        href="/about"
        className="bg-emerald-600 text-white font-semibold p-2 rounded-md -pt-0.5 mt-10 hover:bg-emerald-700"
      >
        Go to About screen
      </Link>
    </View>
  );
}