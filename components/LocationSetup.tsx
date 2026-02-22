
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { saveLocation, LocationData } from '../lib/prayer-service';

interface LocationSetupProps {
    onLocationSet: () => void;
}

export default function LocationSetup({ onLocationSet }: LocationSetupProps) {
    const [loading, setLoading] = useState(false);

    const handleUseCurrentLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const locData: LocationData = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            };

            // Reverse geocode to get city name for display (optional but nice)
            try {
                const reverseGeocode = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
                if (reverseGeocode.length > 0) {
                    locData.city = (reverseGeocode[0].city || reverseGeocode[0].region) ?? undefined;
                    locData.country = reverseGeocode[0].country ?? undefined;
                }
            } catch (e) {
                console.log("Reverse geocoding failed, proceeding with coords only");
            }

            await saveLocation(locData);
            onLocationSet();
        } catch (error) {
            Alert.alert("Error getting location", "Please try again or use manual selection.");
        } finally {
            setLoading(false);
        }
    };

    const handleManualSelection = async (city: string, country: string) => {
        setLoading(true);
        await saveLocation({ city, country });
        setLoading(false);
        onLocationSet();
    };

    return (
        <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-slate-900">
            <Text className="text-2xl font-bold mb-8 text-center text-slate-800 dark:text-slate-100">
                Welcome to DayOfDeen
            </Text>
            <Text className="text-base text-slate-600 dark:text-slate-400 text-center mb-10">
                To calculate accurate prayer times, we need to know your location.
            </Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0ea5e9" />
            ) : (
                <View className="w-full gap-4">
                    <TouchableOpacity
                        className="bg-sky-500 p-4 rounded-xl flex-row justify-center items-center"
                        onPress={handleUseCurrentLocation}
                    >
                        <Text className="text-white font-semibold text-lg">Use Current Location</Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center my-4">
                        <View className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        <Text className="mx-4 text-slate-400">OR</Text>
                        <View className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    </View>

                    <Text className="text-center font-medium mb-2 text-slate-700 dark:text-slate-300">Select Common City</Text>

                    <TouchableOpacity
                        className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700"
                        onPress={() => handleManualSelection("London", "UK")}
                    >
                        <Text className="text-slate-800 dark:text-slate-200 text-center font-medium">London, UK</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700"
                        onPress={() => handleManualSelection("Dhaka", "Bangladesh")}
                    >
                        <Text className="text-slate-800 dark:text-slate-200 text-center font-medium">Dhaka, Bangladesh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700"
                        onPress={() => handleManualSelection("New York", "USA")}
                    >
                        <Text className="text-slate-800 dark:text-slate-200 text-center font-medium">New York, USA</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
