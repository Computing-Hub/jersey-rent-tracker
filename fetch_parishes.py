#!/usr/bin/env python3
"""
Fetch Jersey parish boundaries from OpenStreetMap Overpass API
and output a clean GeoJSON for the Rent Tracker choropleth.

Usage:
    pip install requests osm2geojson
    python fetch_parishes.py
    # Outputs: data/parishes.geojson
"""
import requests
import json
import os

try:
    import osm2geojson
except ImportError:
    print("Installing osm2geojson...")
    os.system("pip install osm2geojson")
    import osm2geojson

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

QUERY = """
[out:json][timeout:60];
relation["admin_level"="8"]["boundary"="administrative"](49.16,-2.26,49.27,-2.01);
out body;
>;
out skel qt;
"""

KEY_MAP = {
    'Saint Helier': 'SH', 'St Helier': 'SH',
    'Saint Clement': 'SC', 'St Clement': 'SC', 'Saint Clément': 'SC',
    'Saint Saviour': 'SS', 'St Saviour': 'SS',
    'Saint Brelade': 'SB', 'St Brelade': 'SB', 'Saint Brélade': 'SB',
    'Saint Lawrence': 'SL', 'St Lawrence': 'SL',
    'Trinity': 'TR', 'La Trinité': 'TR',
    'Grouville': 'GR',
    'Saint Martin': 'SM', 'St Martin': 'SM',
    'Saint Mary': 'SMa', 'St Mary': 'SMa', 'Sainte Marie': 'SMa',
    'Saint Ouen': 'SO', 'St Ouen': 'SO',
    'Saint Peter': 'SP', 'St Peter': 'SP',
    'Saint John': 'SJ', 'St John': 'SJ',
}

DISPLAY = {
    'SH': 'St Helier', 'SC': 'St Clement', 'SS': 'St Saviour',
    'SB': 'St Brelade', 'SL': 'St Lawrence', 'TR': 'Trinity',
    'GR': 'Grouville', 'SM': 'St Martin', 'SMa': 'St Mary',
    'SO': 'St Ouen', 'SP': 'St Peter', 'SJ': 'St John',
}

print("Fetching parish boundaries from Overpass API...")
resp = requests.get(OVERPASS_URL, params={"data": QUERY},
                    headers={"User-Agent": "JerseyRentTracker/1.0"})
resp.raise_for_status()
data = resp.json()
print(f"  Got {len(data['elements'])} elements")

print("Converting to GeoJSON...")
geojson = osm2geojson.json2geojson(data)
print(f"  Got {len(geojson['features'])} features")

out = {"type": "FeatureCollection", "name": "jersey_parishes", "features": []}
for f in geojson['features']:
    tags = f.get('properties', {}).get('tags', {})
    name = tags.get('name', '')
    key = KEY_MAP.get(name)
    if key and f['geometry']['type'] in ('Polygon', 'MultiPolygon'):
        out['features'].append({
            "type": "Feature",
            "properties": {"name": DISPLAY[key], "key": key},
            "geometry": f['geometry']
        })
        print(f"  ✓ {name} → {key}")
    elif name:
        print(f"  ✗ Skipped: {name} (type: {f['geometry']['type']})")

os.makedirs("data", exist_ok=True)
with open("data/parishes.geojson", "w") as fp:
    json.dump(out, fp, indent=2)

print(f"\nDone! Wrote {len(out['features'])} parishes to data/parishes.geojson")
print("Commit and push to update the map.")
