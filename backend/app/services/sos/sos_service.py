import os
import asyncio
import httpx
from dotenv import load_dotenv
from app.services.sos.geo import haversine
from app.config.sos import settings

load_dotenv()

EMERGENCY_MAPPING = {
    "medical": ["hospital", "medical clinic"],
    "fire": ["fire station"],
    "disaster": ["fire station", "hospital"],
    "accident": ["hospital", "trauma center"],
    "violence": ["police station"],
    "rescue": ["rescue service"],
}

async def fetch_places(keyword: str, lat: float, lng: float) -> dict:
    url = (
        "https://serpapi.com/search.json"
        f"?engine=google_maps"
        f"&q={keyword}"
        f"&ll=@{lat},{lng},14z" 
        f"&type=search"
        f"&api_key={settings.SERP_API}"
    )

    async with httpx.AsyncClient(timeout=8) as client: 
        response = await client.get(url)
        if response.status_code == 200:
            return response.json()
    return {}

async def search_best_unit(lat: float, lng: float, emergency_type: str):
    keywords = EMERGENCY_MAPPING.get(emergency_type, ["hospital"])
    
    tasks = [fetch_places(keyword, lat, lng) for keyword in keywords]
    api_responses = await asyncio.gather(*tasks, return_exceptions=True)

    results = []
    seen_places = set() 

    for data in api_responses:
        if not isinstance(data, dict): 
            continue
            
        local_results = data.get("local_results", [])
        for place in local_results:
            place_id = place.get("place_id") or place.get("title")
            if not place_id or place_id in seen_places:
                continue
            
            seen_places.add(place_id)

            gps = place.get("gps_coordinates")
            if not gps or "latitude" not in gps or "longitude" not in gps:
                continue

            distance = haversine(lat, lng, gps["latitude"], gps["longitude"])
            rating = place.get("rating", 0)

            # TIÊU CHÍ SOS: Khoảng cách là số 1.
            # Nếu khoảng cách gần bằng nhau (lệch nhau dưới 200m), mới xét tới rating để tối ưu.
            # Ta tạo một trọng số penalty: Càng xa thì điểm càng cao, rating cao thì giảm nhẹ điểm penalty.
            score = distance * 1.0 - (rating * 0.01) 

            results.append({
                "name": place.get("title"),
                "address": place.get("address"),
                "distance_km": distance,
                "rating": rating,
                "score": score,
            })

    if not results:
        return None

    results.sort(key=lambda x: x["score"])

    return results[0]