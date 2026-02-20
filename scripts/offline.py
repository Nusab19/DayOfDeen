import datetime
from adhanpy.PrayerTimes import PrayerTimes
from adhanpy.calculation.CalculationMethod import CalculationMethod
from adhanpy.calculation.Madhab import Madhab
from adhanpy.calculation.CalculationParameters import CalculationParameters

def calculate_offline_times(lat=None, lon=None, year=None, month=None, day=None, madhab="Hanafi", output="print", time_format="12h"):
    """
    Calculates prayer times offline.
    """
    if lat is None or lon is None:
        return {"Error": "Offline mode requires manual lat and lon coordinates."}

    coords = (lat, lon)

    now = datetime.datetime.now()
    year = year or now.year
    month = month or now.month
    day = day or now.day
    date_obj = datetime.date(year, month, day)

    # 1. Define Parameters explicitly
    # Karachi method uses 18 degrees for both Fajr and Isha
    params = CalculationParameters(fajr_angle=18.0, isha_angle=18.0)

    # 2. Set Madhab (This ONLY affects Asr)
    # Hanafi = Shadow 2x, Shafi = Shadow 1x
    params.madhab = Madhab.HANAFI if madhab.lower() == "hanafi" else Madhab.SHAFI

    try:
        # 3. FIX: Pass 'calculation_parameters' as a KEYWORD argument
        # This ensures the library uses our custom params object instead of defaults
        prayer_times = PrayerTimes(coords, date_obj, calculation_parameters=params)
    except Exception as e:
        return {"Error": f"Calculation failed: {e}"}

    def get_dt(dt_obj):
        return dt_obj if dt_obj else None

    fajr_dt = get_dt(prayer_times.fajr)
    sunrise_dt = get_dt(prayer_times.sunrise)
    dhuhr_dt = get_dt(prayer_times.dhuhr)
    asr_dt = get_dt(prayer_times.asr)
    sunset_dt = get_dt(prayer_times.maghrib)
    maghrib_dt = sunset_dt
    isha_dt = get_dt(prayer_times.isha)

    # Rollover Logic
    isha_end_dt = fajr_dt + datetime.timedelta(days=1)
    night_duration = isha_end_dt - sunset_dt
    midnight_dt = sunset_dt + (night_duration / 2)

    # Forbidden Times
    f_sunrise_end = sunrise_dt + datetime.timedelta(minutes=15)
    f_zawal_start = dhuhr_dt - datetime.timedelta(minutes=10)
    f_sunset_start = maghrib_dt - datetime.timedelta(minutes=15)

    def format_val(dt_obj):
        if not dt_obj: return ""
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
        "forbiddenSunriseEnd": format_val(f_sunrise_end),
        "forbiddenZawalStart": format_val(f_zawal_start),
        "forbiddenSunsetStart": format_val(f_sunset_start),
        "madhabUsed": "Hanafi" if params.madhab == Madhab.HANAFI else "Shafi/Others",
        "methodName": "Karachi (Offline)",
        "methodId": 1
    }

if __name__ == "__main__":
    # Mecca Coordinates for testing
    lat_mecca, lon_mecca = 21.4225, 39.8262

    for m in ["Hanafi", "Shafi"]:
        print(f"\n--- {m} Calculation (Mecca) ---")
        results = calculate_offline_times(lat=lat_mecca, lon=lon_mecca, madhab=m)
        for k, v in results.items():
            print(f"{k:22}: {v}")
