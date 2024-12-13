// @ts-nocheck
"use client";

import React, { Suspense, lazy, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Noto_Sans } from "next/font/google";
import createPlotlyComponent from "react-plotly.js/factory";

// Define types for Plotly data and layout
interface PlotlyData {
  data: any[];
  layout: any;
  frames?: any[];
  config?: any;
}

// Declare Plot variable with proper type
let Plot: React.ComponentType<any>;

const API_URL = "https://5acd977c37c4bc9140.gradio.live";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
});

interface GradioComponentProps {
  api_endpoint: string;
}

const GradioUpdateTime: React.FC<GradioComponentProps> = ({ api_endpoint }) => {
  const [timeData, setTimeData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
          .then((r) => r.body!.getReader())
          .then((reader) => {
            let result = "";
            return reader.read().then(function process({ done, value }): Promise<string> {
              if (done) return Promise.resolve(result);
              result += new TextDecoder().decode(value);
              return reader.read().then(process);
            });
          })
          .then((text) => {
            const sseData = text.split("data: ")[1];
            const dataList = JSON.parse(sseData);
            return dataList[0]["value"];
          });

        setTimeData(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
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

const GradioPlotlyChart: React.FC<GradioComponentProps> = ({ api_endpoint }) => {
  const [plotData, setPlotData] = useState<PlotlyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
          .then((r) => r.body!.getReader())
          .then((reader) => {
            let result = "";
            return reader.read().then(function process({ done, value }): Promise<string> {
              if (done) return Promise.resolve(result);
              result += new TextDecoder().decode(value);
              return reader.read().then(process);
            });
          })
          .then((text) => {
            const sseData = text.split("data: ")[1];
            const dataList = JSON.parse(sseData);
            return JSON.parse(dataList[0]);
          });

        setPlotData(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
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
            ...(plotData.layout?.title || {}),
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

function scriptExists(src: string): boolean {
  return Array.from(document.getElementsByTagName("script")).some(
    (el) => el.src === src,
  );
}

const LeaderboardEmbed: React.FC = () => {
  useEffect(() => {
    if (!scriptExists("https://cdn.plot.ly/plotly-2.35.2.min.js")) {
      const script = document.createElement("script");
      script.src = "https://cdn.plot.ly/plotly-2.35.2.min.js";
      script.charset = "utf-8";

      document.head.appendChild(script);

      script.onload = () => {
        // @ts-ignore - Plotly will be available globally after script loads
        Plot = createPlotlyComponent(Plotly);
      };
    }
  }, []);

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