import requests
from datetime import datetime, timedelta
from prayer_methods import CalculationMethod

class PrayerTimeService:
    def __init__(self, method: CalculationMethod = CalculationMethod.KARACHI):
        self.base_url = "https://api.aladhan.com/v1"
        self.method = method.value

    def _parse_time(self, t_str):
        if "T" in t_str:
            clean_ts = t_str.split('+')[0]
            try:
                return datetime.fromisoformat(clean_ts)
            except ValueError:
                return datetime.strptime(clean_ts, "%Y-%m-%dT%H:%M:%S")
        else:
            t = datetime.strptime(t_str, "%H:%M").time()
            return datetime.combine(datetime.today(), t)

    def fetch_times(self, lat=None, lon=None, city=None, country=None, madhab="Hanafi", output="details", time_format="12h"):
        school_param = 1 if madhab.lower() == "hanafi" else 0
        params = {"method": self.method, "school": school_param, "iso8601": 1}

        if lat and lon:
            endpoint = f"{self.base_url}/timings"
            params.update({"latitude": lat, "longitude": lon})
        elif city and country:
            endpoint = f"{self.base_url}/timingsByCity"
            params.update({"city": city, "country": country})
        else:
            return None

        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            data = response.json()["data"]
            t_raw = data["timings"]
            meta = data["meta"]

            fajr_dt = self._parse_time(t_raw["Fajr"])
            sunrise_dt = self._parse_time(t_raw["Sunrise"])
            dhuhr_dt = self._parse_time(t_raw["Dhuhr"])
            asr_dt = self._parse_time(t_raw["Asr"])
            sunset_dt = self._parse_time(t_raw["Sunset"])
            maghrib_dt = sunset_dt
            isha_dt = self._parse_time(t_raw["Isha"])

            midnight_dt = self._parse_time(t_raw["Midnight"])
            if midnight_dt.hour < 12:
                midnight_dt += timedelta(days=1)

            isha_end_dt = fajr_dt + timedelta(days=1)

            f_sun_end = sunrise_dt + timedelta(minutes=15)
            f_zawal_start = dhuhr_dt - timedelta(minutes=10)
            f_sunset_start = maghrib_dt - timedelta(minutes=15)

            def format_val(dt_obj):
                if output == "print":
                    fmt = "%I:%M %p" if time_format == "12h" else "%H:%M"
                    return dt_obj.strftime(fmt)
                return dt_obj.isoformat()

            return {
                "fajrStart": format_val(fajr_dt),
                "sunrise": format_val(sunrise_dt),
                "duhrStart": format_val(dhuhr_dt),
                "asrStart": format_val(asr_dt),
                "sunset": format_val(sunset_dt),
                "magribEnd": format_val(isha_dt),
                "ishaStart": format_val(isha_dt),
                "ishaEnd": format_val(isha_end_dt),
                "midnight": format_val(midnight_dt),
                "forbiddenSunriseEnd": format_val(f_sun_end),
                "forbiddenZawalStart": format_val(f_zawal_start),
                "forbiddenSunsetStart": format_val(f_sunset_start),
                "madhabUsed": "Hanafi" if school_param == 1 else "Shafi/Others",
                "methodName": meta["method"]["name"]
            }
        except Exception as e:
            print(f"Error fetching times: {e}")
            return None
