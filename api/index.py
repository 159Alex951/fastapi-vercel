from fastapi import FastAPI, Query
import json
from pathlib import Path
from typing import Optional

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

JSON_FILE_PATH = Path("src/meteodaten_2023_daily.json")

@app.get("/api/py/meteodaten")
def get_meteodaten(
    location: Optional[str] = Query(None, description="Filter nach Standortname"),
    start_date: Optional[int] = Query(None, description="Startdatum (Unix-Timestamp)"),
    end_date: Optional[int] = Query(None, description="Enddatum (Unix-Timestamp)"),
):
    try:
        with open(JSON_FILE_PATH, encoding="utf-8") as file:
            data = json.load(file)
        
        # Datenfilterung
        if location:
            data = [entry for entry in data if entry["Standortname"] == location]
        if start_date:
            data = [entry for entry in data if entry["Datum"] >= start_date]
        if end_date:
            data = [entry for entry in data if entry["Datum"] <= end_date]
        
        return data
    except FileNotFoundError:
        return {"error": "JSON file not found. Please check the path and filename."}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON format. Please check the file content."}
