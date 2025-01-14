// components/WeatherVegaLiteChart.js
import React, { useEffect, useRef } from "react";
import vegaEmbed from "vega-embed";

export const WeatherVegaLiteChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      const chartData = data.map((item) => ({
        date: new Date(item.Datum).toLocaleDateString(),
        temperature: item.T,
        location: item.Standortname,
      }));

      const spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "Temperature over time",
        data: {
          values: chartData,
        },
        mark: "line",
        encoding: {
          x: { field: "date", type: "temporal", title: "Datum" },
          y: {
            field: "temperature",
            type: "quantitative",
            title: "Temperatur (°C)",
          },
          color: { field: "location", type: "nominal", title: "Standort" },
        },
      };

      vegaEmbed(chartRef.current, spec);
    }
  }, [data]);

  return <div ref={chartRef}></div>;
};
