import React, { useState, useEffect } from "react";

const WeatherApp = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("api/py/meteodaten")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Daten.");
        }
        return response.json();
      })
      .then((data) => {
        const uniqueLocations = [
          ...new Set(data.map((entry) => entry.Standortname)),
        ];
        setLocations(uniqueLocations);
        setWeatherData(data);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Fehler beim Laden der Daten. Bitte überprüfe die Verbindung."
        );
      });
  }, []);

  const handleLocationChange = (event) => {
    const location = event.target.value;
    setSelectedLocation(location);

    fetch(`/api/py/meteodaten?location=${encodeURIComponent(location)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der gefilterten Daten.");
        }
        return response.json();
      })
      .then((data) => setWeatherData(data))
      .catch((err) => {
        console.error(err);
        setError("Fehler beim Abrufen der Daten. Bitte versuche es erneut.");
      });
  };

  return (
    <div>
      <h1>Wetterdaten-Visualisierung</h1>

      <label htmlFor="location-select">Wähle einen Standort:</label>
      <select
        id="location-select"
        value={selectedLocation}
        onChange={handleLocationChange}
      >
        <option value="">Alle Standorte</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Standort</th>
            <th>Temperatur</th>
            <th>Regen (Dauer)</th>
            <th>Druck</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map((entry, index) => (
            <tr key={index}>
              <td>{new Date(entry.Datum).toLocaleDateString()}</td>
              <td>{entry.Standortname}</td>
              <td>{entry.T}°C</td>
              <td>{entry.RainDur} Minuten</td>
              <td>{entry.p} hPa</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherApp;
