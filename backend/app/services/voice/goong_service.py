import requests
from app.config.voice import settings
from geopy.geocoders import Nominatim

def geocode(place):
    url = settings.GOONG_GEOCODE_URL
    API_KEY = settings.GOONG_API_KEY
    
    # response = requests.get(url, params={
    #     "address": place,
    #     "api_key": API_KEY
    # })
    geocode = Nominatim("Project TDTT")
    response = geocode.geocode(place)
    # data = response.json()

    # location = data["results"][0]["geometry"]["location"]

    # return {
    #     "lat": location["lat"],
    #     "lng": location["lng"]
    # }
    return {
        "lat": response.latitude,
        "lng": response.longitude
    }