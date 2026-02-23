import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { WelcomeText } from "../components/WelcomeText";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-zinc-900">
            <WelcomeText />
            <StatusBar style="light" />
        </View>
    );
}
