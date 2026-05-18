import requests
from app.config.weather import settings

def call_weather_api(endpoint, params=None):
    url = f"{settings.BASE_URL}{endpoint}"
    print(f'This is an url: {url}')
    
<<<<<<< HEAD
    query = {
        "key": settings.WEATHER_API_KEY,
        "lang": "vi"}
=======
    query = {"key": settings.WEATHER_API_KEY}
>>>>>>> BE_Warning

    if params:
        query.update(params)

    try:
        response = requests.get(
            url,
            params=query,
            timeout=10
        )
        return response
    except requests.RequestException as e:
        raise Exception(
            f"Weather API request failed: {str(e)}"
        )