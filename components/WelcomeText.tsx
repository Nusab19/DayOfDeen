import { Text, View } from "react-native";

export function WelcomeText() {
    return (
        <View className="items-center">
            <Text className="text-3xl font-extrabold text-blue-400">DayOfDeen</Text>
            <Text className="text-base text-zinc-400 mt-2">NativeWind v4 Router setup is working!</Text>
        </View>
    );
}
