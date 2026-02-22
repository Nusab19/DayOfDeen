
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { getLocation, LocationData } from '../lib/prayer-service';
import LocationSetup from '../components/LocationSetup';
import PrayerTimesDisplay from '../components/PrayerTimesDisplay';
import './global.css';

export default function Index() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [checking, setChecking] = useState(true);

  const checkLocation = async () => {
    setChecking(true);
    const savedLoc = await getLocation();
    setLocation(savedLoc);
    setChecking(false);
  };

  useEffect(() => {
    checkLocation();
  }, []);

  if (checking) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {!location ? (
        <LocationSetup onLocationSet={checkLocation} />
      ) : (
        <PrayerTimesDisplay location={location} onResetLocation={checkLocation} />
      )}
    </SafeAreaView>
  );
}
