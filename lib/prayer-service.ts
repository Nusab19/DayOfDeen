
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "https://api.aladhan.com/v1";

export interface PrayerTimes {
  fajrStart: string;
  sunrise: string;
  duhrStart: string;
  asrStart: string;
  sunset: string;
  magribEnd: string;
  ishaStart: string;
  ishaEnd: string;
  midnight: string;
  forbiddenSunriseEnd: string;
  forbiddenZawalStart: string;
  forbiddenSunsetStart: string;
  madhabUsed: string;
  methodName: string;
}

export interface LocationData {
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

const parseTime = (tStr: string): Date => {
  if (tStr.includes("T")) {
    const cleanTs = tStr.split('+')[0];
    return new Date(cleanTs);
  } else {
    const [hours, minutes] = tStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
};

export const fetchPrayerTimes = async (location: LocationData, madhab: "Hanafi" | "Shafi" = "Hanafi"): Promise<PrayerTimes | null> => {
  const schoolParam = madhab === "Hanafi" ? 1 : 0;
  // Use Karachi method (1) as default, similar to Python script
  let params: any = { method: 1, school: schoolParam, iso8601: 1 };

  let endpoint = "";
  if (location.latitude && location.longitude) {
    endpoint = `${BASE_URL}/timings`;
    params.latitude = location.latitude;
    params.longitude = location.longitude;
  } else if (location.city && location.country) {
    endpoint = `${BASE_URL}/timingsByCity`;
    params.city = location.city;
    params.country = location.country;
  } else {
    return null;
  }

  // Construct query string manually to avoid URLSearchParams issues in some RN environments if needed,
  // but standard fetch usually handles it using URL object or simple string concatenation.
  const queryString = new URLSearchParams(params).toString();
  const url = `${endpoint}?${queryString}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    
    if (json.code !== 200) {
      console.error("API Error:", json.status);
      return null;
    }

    const data = json.data;
    const tRaw = data.timings;
    const meta = data.meta;

    const fajrDt = parseTime(tRaw.Fajr);
    const sunriseDt = parseTime(tRaw.Sunrise);
    const dhuhrDt = parseTime(tRaw.Dhuhr);
    const asrDt = parseTime(tRaw.Asr);
    const sunsetDt = parseTime(tRaw.Sunset);
    // Maghrib is same as Sunset in this API usually, but good to be explicit
    const maghribDt = sunsetDt; 
    const ishaDt = parseTime(tRaw.Isha);
    const midnightDt = parseTime(tRaw.Midnight);

    // Midnight rollover check (if midnight is effectively next day early morning)
    if (midnightDt.getHours() < 12) {
      midnightDt.setDate(midnightDt.getDate() + 1);
    }

    const ishaEndDt = new Date(fajrDt);
    ishaEndDt.setDate(ishaEndDt.getDate() + 1);

    const fSunEnd = new Date(sunriseDt.getTime() + 15 * 60000);
    const fZawalStart = new Date(dhuhrDt.getTime() - 10 * 60000);
    const fSunsetStart = new Date(maghribDt.getTime() - 15 * 60000);

    return {
      fajrStart: formatTime(fajrDt),
      sunrise: formatTime(sunriseDt),
      duhrStart: formatTime(dhuhrDt),
      asrStart: formatTime(asrDt),
      sunset: formatTime(sunsetDt),
      magribEnd: formatTime(ishaDt), // Using Isha start as Maghrib end approximation/display
      ishaStart: formatTime(ishaDt),
      ishaEnd: formatTime(ishaEndDt),
      midnight: formatTime(midnightDt),
      forbiddenSunriseEnd: formatTime(fSunEnd),
      forbiddenZawalStart: formatTime(fZawalStart),
      forbiddenSunsetStart: formatTime(fSunsetStart),
      madhabUsed: schoolParam === 1 ? "Hanafi" : "Shafi/Others",
      methodName: meta.method.name
    };

  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const saveLocation = async (location: LocationData) => {
  try {
    await AsyncStorage.setItem('user_location', JSON.stringify(location));
  } catch (e) {
    console.error("Failed to save location", e);
  }
};

export const getLocation = async (): Promise<LocationData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('user_location');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to fetch location", e);
    return null;
  }
};

export const clearLocation = async () => {
    try {
        await AsyncStorage.removeItem('user_location');
    } catch (e) {
        console.error("Failed to clear location", e);
    }
}
