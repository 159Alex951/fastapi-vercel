import { useEffect, useState } from "react";
import axios from "axios";
import WeatherVegaLiteChart from "../components/las-VEGAs";
import WeatherApp from "../components/WeatherApp";

const Home = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    axios
      .get("api/py/meteodaten")
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Wetterdaten:", error);
      });
  }, []);

  return (
    <div>
      <h1>Wetterdaten Visualisierung mit Vega-Lite</h1>
      {weatherData.length > 0 ? (
        <WeatherVegaLiteChart data={weatherData} />
      ) : (
        <p>Lade Wetterdaten...</p>
      )}
      <div>
        <WeatherApp />
      </div>
    </div>
  );
};

export default Home;
