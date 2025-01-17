import { useEffect, useState } from "react";
import axios from "axios";
import { WeatherVegaLiteChart } from "../components/lasVegas";
import { WeatherFilters } from "../components/weatherFilter";
import "../styles/darkmode.css";

const Home = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

  useEffect(() => {
    if (sortConfig.key) {
      const sortedData = [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
      setFilteredData(sortedData);
    }
  }, [sortConfig]);

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc";
      return { key, direction };
    });
  };

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <h1>Wetterdaten Visualisierung</h1>
        <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: isDarkMode ? "#fff" : "#000" }}>Dark Mode</span>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
        </label>
      </header>

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: isDarkMode ? "#fff" : "#000" }}>
          Temperaturdaten (gefiltert nach Auswahl)
        </h2>
        <WeatherVegaLiteChart
          data={filteredData}
          field="T"
          title="Temperaturen in °C"
        />
      </div>

      <div>
        <h2 style={{ color: isDarkMode ? "#fff" : "#000" }}>Filter</h2>
        <WeatherFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          locations={Array.from(
            new Set(weatherData.map((item) => item.Standortname))
          )}
        />
      </div>

      <div>
        <h2 style={{ color: isDarkMode ? "#fff" : "#000" }}>
          Gefilterte Wetterdaten
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: isDarkMode ? "#333" : "#fff",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: isDarkMode ? "#444" : "#ddd",
                color: isDarkMode ? "#fff" : "#000",
              }}
            >
              <th
                style={{
                  border: "1px solid",
                  padding: "8px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("Datum")}
              >
                Datum
              </th>
              <th
                style={{
                  border: "1px solid",
                  padding: "8px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("Standortname")}
              >
                Standort
              </th>
              <th
                style={{
                  border: "1px solid",
                  padding: "8px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("T")}
              >
                Temperatur (°C)
              </th>
              <th
                style={{
                  border: "1px solid",
                  padding: "8px",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("RainDur")}
              >
                Regendauer (Minuten)
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} style={{ color: isDarkMode ? "#fff" : "#000" }}>
                <td style={{ border: "1px solid", padding: "8px" }}>
                  {new Date(item.Datum).toLocaleDateString()}
                </td>
                <td style={{ border: "1px solid", padding: "8px" }}>
                  {item.Standortname}
                </td>
                <td style={{ border: "1px solid", padding: "8px" }}>
                  {item.T}
                </td>
                <td style={{ border: "1px solid", padding: "8px" }}>
                  {item.RainDur}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
