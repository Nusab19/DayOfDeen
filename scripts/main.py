from location import get_current_location
from prayer_methods import CalculationMethod
from prayer_time_service import PrayerTimeService

def print_location_comparison(service, city=None, country=None, lat=None, lon=None, label=""):
    print(f"\n{'='*20} {label} {'='*20}")

    for madhab in ["Shafi", "Hanafi"]:
        madhab_label = "Hanafi" if madhab == "Hanafi" else "Shafi/Hanbali/Maliki"
        print(f"\n--- {madhab_label} ---")

        times = service.fetch_times(
            city=city, country=country, lat=lat, lon=lon,
            madhab=madhab, output="print"
        )

        if times:
            for k, v in times.items():
                print(f"{k:22}: {v}")
        return

def main():
    service = PrayerTimeService(method=CalculationMethod.KARACHI)

    # 1. London
    print_location_comparison(service, city="London", country="UK", label="LONDON, UK")
    return

    # 2. Dhaka
    print_location_comparison(service, city="Dhaka", country="Bangladesh", label="DHAKA, BANGLADESH")

    # 3. Current Location
    loc = get_current_location()
    if loc:
        print_location_comparison(
            service, lat=loc['lat'], lon=loc['lon'],
            label=f"MY LOCATION ({loc['city']})"
        )

if __name__ == "__main__":
    main()
