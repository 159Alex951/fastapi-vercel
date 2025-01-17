# from fastapi import FastAPI, Query
# from fastapi.responses import JSONResponse
# import json
# from typing import Optional

# app = FastAPI()

# def load_weather_data():
#     with open("data/meteodaten_2023_daily.json", "r", encoding="utf-8") as file:
#         return json.load(file)

# weather_data = load_weather_data()

# @app.get("/weather")
# def get_weather(
#     location: Optional[str] = Query(None, description="Filter nach Standort"),
#     start_date: Optional[int] = Query(None, description="Startdatum (Unix-Timestamp)"),
#     end_date: Optional[int] = Query(None, description="Enddatum (Unix-Timestamp)"),
# ):
#     """
#     Endpunkt für Wetterdaten mit optionalen Filtern:
#     - location: Filter nach Standortname
#     - start_date: Filter nach Startdatum (Unix-Timestamp)
#     - end_date: Filter nach Enddatum (Unix-Timestamp)
#     """
#     filtered_data = weather_data

#     if location:
#         filtered_data = [
#             entry for entry in filtered_data if entry["Standortname"] == location
#         ]
#     if start_date:
#         filtered_data = [
#             entry for entry in filtered_data if entry["Datum"] >= start_date
#         ]
#     if end_date:
#         filtered_data = [
#             entry for entry in filtered_data if entry["Datum"] <= end_date
#         ]

#     return JSONResponse(content=filtered_data)
