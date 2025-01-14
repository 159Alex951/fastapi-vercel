import React from "react";

export const WeatherFilters = ({ filters, onFilterChange, locations }) => {
  return (
    <div>
      {/* Standortfilter */}
      <div>
        <label>Standort:</label>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange("location", e.target.value)}
        >
          <option value="">Alle Standorte</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Temperaturfilter */}
      <div>
        <label>Temperatur:</label>
        <select
          value={filters.temperature}
          onChange={(e) => onFilterChange("temperature", e.target.value)}
        >
          <option value="">Alle</option>
          <option value="below_0">Unter 0°C</option>
          <option value="0_10">0 bis 10°C</option>
          <option value="10_20">10 bis 20°C</option>
          <option value="above_20">Über 20°C</option>
        </select>
      </div>

      {/* Regendauerfilter */}
      <div>
        <label>Regendauer:</label>
        <select
          value={filters.rainDuration}
          onChange={(e) => onFilterChange("rainDuration", e.target.value)}
        >
          <option value="">Alle</option>
          <option value="below_60">Unter 60 Minuten</option>
          <option value="60_120">60 bis 120 Minuten</option>
          <option value="above_120">Über 120 Minuten</option>
        </select>
      </div>
    </div>
  );
};
