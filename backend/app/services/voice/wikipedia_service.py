import requests
from app.config.voice import settings

def get_place_info(place):
    url = f"{settings.WIKI_BASE_URL}{place}"

    response = requests.get(url)

    if response.status_code != 200:
        return None

    return response.json().get("extract")