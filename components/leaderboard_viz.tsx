"use client";

import React, { Suspense, lazy, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Noto_Sans } from "next/font/google";

// customizable method: use your own `Plotly` object
import createPlotlyComponent from "react-plotly.js/factory";

var Plot;

const API_URL = "https://5acd977c37c4bc9140.gradio.live";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
});

const GradioUpdateTime = ({ api_endpoint }) => {
  const [timeData, setTimeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const result = await fetch(
          `${API_URL}/gradio_api/call/${api_endpoint}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [] }),
          },
        )
          .then((r) => r.json())
          .then((j) =>
            fetch(`${API_URL}/gradio_api/call/${api_endpoint}/${j.event_id}`),
          )
          .then((r) => r.body.getReader())
          .then((reader) => {
            let result = "";
            return reader.read().then(function process({ done, value }) {
              if (done) return result;
              result += new TextDecoder().decode(value);
              return reader.read().then(process);
            });
          })
          .then((text) => {
            // Parse the SSE data format
            const sseData = text.split("data: ")[1];
            // Parse the string into a list
            const dataList = JSON.parse(sseData);
            // Parse the first element as JSON
            return dataList[0]["value"];
          });

        setTimeData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (api_endpoint) {
      fetchTime();
    } else {
      setError("No API endpoint provided");
      setLoading(false);
    }
  }, [api_endpoint]);

  if (loading) {
    return <div className="flex items-center justify-center h-auto"></div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-auto">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!timeData) {
    return (
      <div className="flex items-center justify-center h-auto">
        <div className="text-gray-600">No plot data available</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-auto">
      <div align="center" dangerouslySetInnerHTML={{ __html: timeData }} />
    </div>
  );
};

const GradioPlotlyChart = ({ api_endpoint }) => {
  const [plotData, setPlotData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const result = await fetch(
          `${API_URL}/gradio_api/call/${api_endpoint}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [] }),
          },
        )
          .then((r) => r.json())
          .then((j) =>
            fetch(`${API_URL}/gradio_api/call/${api_endpoint}/${j.event_id}`),
          )
          .then((r) => r.body.getReader())
          .then((reader) => {
            let result = "";
            return reader.read().then(function process({ done, value }) {
              if (done) return result;
              result += new TextDecoder().decode(value);
              return reader.read().then(process);
            });
          })
          .then((text) => {
            // Parse the SSE data format
            const sseData = text.split("data: ")[1];
            // Parse the string into a list
            const dataList = JSON.parse(sseData);
            // Parse the first element as JSON
            return JSON.parse(dataList[0]);
          });

        setPlotData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (api_endpoint) {
      fetchPlotData();
    } else {
      setError("No API endpoint provided");
      setLoading(false);
    }
  }, [api_endpoint]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-auto">
        <div className="animate-pulse text-gray-600">Loading plot data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-auto">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!plotData) {
    return (
      <div className="flex items-center justify-center h-auto">
        <div className="text-gray-600">No plot data available</div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: "max(min(425px, 47vw), 50vh)" }}>
      <Plot
        data={Array.isArray(plotData.data) ? plotData.data : [plotData.data]}
        layout={{
          autosize: true,
          ...plotData.layout,
          margin: { l: 0, r: 0, t: 50, b: 10 },
          title: {
            ...(plotData.layout?.title || {}), // Preserve existing title properties
            y: 0.95,
            x: 0.5,
            xanchor: "center",
            yanchor: "top",
          },
          font: {
            family: notoSans.style.fontFamily,
          },
        }}
        frames={plotData.frames}
        config={{
          responsive: true,
          ...plotData.config,
        }}
        className={notoSans.className}
        style={{
          width: "min(850px, 98vw)",
          marginLeft: "calc((100% - min(850px, 98vw)) / 2)",
          height: "100%",
        }}
        useResizeHandler={true}
      />
    </div>
  );
};

function scriptExists(src) {
  return Array.from(document.getElementsByTagName("script")).some(
    (el) => el.src === src,
  );
}

const LeaderboardEmbed = () => {
  useEffect(() => {
    if (!scriptExists("https://cdn.plot.ly/plotly-2.35.2.min.js")) {
      // Create script element
      const script = document.createElement("script");
      script.src = "https://cdn.plot.ly/plotly-2.35.2.min.js";
      script.charset = "utf-8";

      // Append script to document head
      document.head.appendChild(script);

      script.onload = () => {
        Plot = createPlotlyComponent(Plotly);
      };
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="max-w-4xl mx-auto">
      <GradioUpdateTime api_endpoint="get_update_time" />
      <GradioPlotlyChart api_endpoint="get_wr_plot" />
      <br />
      <GradioPlotlyChart api_endpoint="get_bt_plot" />
    </div>
  );
};

export default LeaderboardEmbed;
