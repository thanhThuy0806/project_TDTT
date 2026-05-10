import requests
from app.config.voice import settings

def geocode(place):
    url = settings.GOONG_GEOCODE_URL
    API_KEY = settings.GOONG_API_KEY
    
    response = requests.get(url, params={
        "address": place,
        "api_key": API_KEY
    })

    data = response.json()

    location = data["results"][0]["geometry"]["location"]

    return {
        "lat": location["lat"],
        "lng": location["lng"]
    }