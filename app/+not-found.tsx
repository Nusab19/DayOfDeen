import { Link } from "expo-router";
import { Text, View } from "react-native";

import { SearchXIcon } from "lucide-react-native";

export default function NotFoundScreen() {
  return (
    <>
      <View className="flex-1 items-center justify-center bg-gray-900 px-4">
        <View className="items-center space-y-6">
          <SearchXIcon size={120} color="#EF4444" />

          <View className="items-center space-y-2">
            <Text className="text-red-500 text-4xl font-bold text-center">
              Oops! Page Not Found
            </Text>
            <Text className="text-gray-400 text-lg text-center">
              The page you are looking for doesn&apos;t exist or has been moved.
            </Text>
          </View>

          <Link href="/" asChild>
            <View className="bg-blue-600 px-6 py-3 rounded-full mt-4 flex-row items-center space-x-2">
              <SearchXIcon size={24} color="white" />
              <Text className="text-white font-semibold text-lg">
                Back to Home
              </Text>
            </View>
          </Link>
        </View>
      </View>
    </>
  );
}
