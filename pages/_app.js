import { useEffect, useState } from "react";
import axios from "axios";
import { WeatherVegaLiteChart } from "../components/lasVegas";
import { WeatherFilters } from "../components/weatherFilter";

const Home = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    temperature: "",
    rainDuration: "",
  });

  useEffect(() => {
    axios
      .get("api/py/meteodaten")
      .then((response) => {
        setWeatherData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Wetterdaten:", error);
      });
  }, []);

  useEffect(() => {
    let filtered = weatherData;

    if (filters.location) {
      filtered = filtered.filter(
        (item) => item.Standortname === filters.location
      );
    }

    if (filters.temperature) {
      filtered = filtered.filter((item) => {
        if (filters.temperature === "below_0") return item.T < 0;
        if (filters.temperature === "0_10") return item.T >= 0 && item.T <= 10;
        if (filters.temperature === "10_20") return item.T > 10 && item.T <= 20;
        if (filters.temperature === "above_20") return item.T > 20;
        return true;
      });
    }

    if (filters.rainDuration) {
      filtered = filtered.filter((item) => {
        if (filters.rainDuration === "below_60") return item.RainDur < 60;
        if (filters.rainDuration === "60_120")
          return item.RainDur >= 60 && item.RainDur <= 120;
        if (filters.rainDuration === "above_120") return item.RainDur > 120;
        return true;
      });
    }

    setFilteredData(filtered);
  }, [filters, weatherData]);

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  return (
    <div>
      <h1>Wetterdaten Visualisierung</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Temperaturdaten (gefiltert nach Standort)</h2>
        <WeatherVegaLiteChart
          data={filteredData}
          field="T"
          title="Temperaturen in °C"
        />
      </div>

      <div>
        <h2>Filter</h2>
        <WeatherFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          locations={Array.from(
            new Set(weatherData.map((item) => item.Standortname))
          )}
        />
      </div>

      <div>
        <h2>Gefilterte Wetterdaten</h2>
        <table>
          <thead>
            <tr>
              <th>Standort</th>
              <th>Temperatur (°C)</th>
              <th>Regendauer (Minuten)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.Standortname}</td>
                <td>{item.T}</td>
                <td>{item.RainDur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
