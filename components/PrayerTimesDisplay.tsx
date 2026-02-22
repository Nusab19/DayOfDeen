
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { fetchPrayerTimes, PrayerTimes, LocationData, clearLocation } from '../lib/prayer-service';

interface PrayerTimesDisplayProps {
    location: LocationData;
    onResetLocation: () => void;
}

export default function PrayerTimesDisplay({ location, onResetLocation }: PrayerTimesDisplayProps) {
    const [times, setTimes] = useState<PrayerTimes | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const data = await fetchPrayerTimes(location);
            setTimes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [location]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadData();
    }, []);

    const handleReset = async () => {
        await clearLocation();
        onResetLocation();
    }

    if (loading && !refreshing) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#0ea5e9" />
            </View>
        );
    }

    if (!times) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-red-500 mb-4">Error fetching prayer times.</Text>
                <TouchableOpacity onPress={loadData} className="bg-sky-500 px-4 py-2 rounded">
                    <Text className="text-white">Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} className="mt-8">
                    <Text className="text-slate-500 underline">Reset Location</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const PrayerRow = ({ name, time, isNext = false }: { name: string, time: string, isNext?: boolean }) => (
        <View className={`flex-row justify-between items-center p-4 rounded-xl mb-3 ${isNext ? 'bg-sky-100 border-sky-300 border' : 'bg-slate-50 border border-slate-100'}`}>
            <Text className={`text-lg font-medium ${isNext ? 'text-sky-800' : 'text-slate-700'}`}>{name}</Text>
            <Text className={`text-lg font-bold ${isNext ? 'text-sky-900' : 'text-slate-900'}`}>{time}</Text>
        </View>
    );

    const getCityDisplay = () => {
        if (location.city) return `${location.city}, ${location.country}`;
        return `Lat: ${location.latitude?.toFixed(2)}, Lon: ${location.longitude?.toFixed(2)}`;
    }

    return (
        <View className="flex-1 bg-white pt-10">
            <View className="px-6 py-4 flex-row justify-between items-center border-b border-slate-100">
                <View>
                    <Text className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Location</Text>
                    <Text className="text-xl font-bold text-slate-800">{getCityDisplay()}</Text>
                </View>
                <TouchableOpacity onPress={handleReset}>
                    <Text className="text-sky-500 font-medium">Change</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-6 pt-4"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text className="text-slate-400 text-center mb-6 text-sm">{times.methodName}</Text>

                <PrayerRow name="Fajr" time={times.fajrStart} />
                <PrayerRow name="Sunrise" time={times.sunrise} />
                <PrayerRow name="Dhuhr" time={times.duhrStart} />
                <PrayerRow name="Asr" time={times.asrStart} />
                <PrayerRow name="Maghrib" time={times.sunset} />
                <PrayerRow name="Isha" time={times.ishaStart} />

                <View className="h-px bg-slate-200 my-4" />

                <Text className="text-slate-500 font-semibold mb-3">Additional Times</Text>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-slate-400">Midnight (Islamic)</Text>
                    <Text className="text-slate-600 font-medium">{times.midnight}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-slate-400">Tahajjud End (Fajr)</Text>
                    <Text className="text-slate-600 font-medium">{times.fajrStart}</Text>
                </View>

                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
