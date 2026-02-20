import requests

def get_current_location():
    """
    Fetches the user's current location based on IP address.
    Returns a dictionary with lat, lon, city, and country.
    """
    try:
        # Using ip-api.com (Reliable, no key required for hobby use)
        response = requests.get("http://ip-api.com/json/")
        response.raise_for_status()
        data = response.json()

        if data.get('status') == 'success':
            return {
                "lat": data['lat'],
                "lon": data['lon'],
                "city": data['city'],
                "country": data['country']
            }
        return None
    except Exception as e:
        print(f"Location detection failed: {e}")
        return None
