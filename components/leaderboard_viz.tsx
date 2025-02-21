"use client";

import React, { useState, useEffect } from "react";
import { Noto_Sans } from "next/font/google";
import Script from "next/script";

import type { PlotParams } from "react-plotly.js";

// Plotly types
interface Plotly {
  newPlot: (
    element: HTMLElement,
    data: any[],
    layout?: any,
    config?: any,
  ) => void;
  react: (
    element: HTMLElement,
    data: any[],
    layout?: any,
    config?: any,
  ) => void;
}

declare global {
  interface Window {
    Plotly: Plotly;
  }
}

// Configure font
const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
});

// Constants
const API_URL = "https://talkarena-viz.williamheld.com";
const FETCH_TIMEOUT = 30000; // 30 seconds timeout
const PLOTLY_SCRIPT_URL = "https://cdn.plot.ly/plotly-2.35.2.min.js";

// Types
interface PlotData {
  data: any[];
  layout?: any;
  frames?: any[];
  config?: any;
}

interface UpdateTime {
  timestamp: string;
  total_votes: string;
  public_votes: string;
  prolific_votes: string;
}

interface GradioProps {
  api_endpoint: string;
}

interface GradioResponse<T> {
  value: T;
  event_id?: string;
}

// Initialize Plot component
let Plot: React.ComponentType<PlotParams>;

// Utility Functions
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

const fetchAPIData = async <T,>(endpoint: string): Promise<T> => {
  const initialResponse = await fetchWithTimeout(`${API_URL}/api/${endpoint}`, {
    method: "GET",
  });

  const initialJson = await initialResponse.json();
  return initialJson;
};

// Components
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-auto">
    <div className="animate-pulse">Loading...</div>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-auto">
    <div className="text-red-500">{message}</div>
  </div>
);

const GradioUpdateTime: React.FC<GradioProps> = ({ api_endpoint }) => {
  const [timeData, setTimeData] = useState<UpdateTime | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const data = await fetchAPIData<UpdateTime>(api_endpoint);
        setTimeData(data);
      } catch (err) {
        console.error("Error fetching time data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
  }, [api_endpoint]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!timeData) return <ErrorMessage message="No data available" />;

  return (
    <div className="flex items-center justify-center h-auto">
      <div className="text-center">
        <h4 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-text-xl">
          Last Refresh: {timeData.timestamp} PST
        </h4>
        <h6 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-text-base">
          Total Votes: {timeData.total_votes}, Public Votes:{" "}
          {timeData.public_votes}, Prolific Votes: {timeData.prolific_votes}
        </h6>
      </div>
    </div>
  );
};

const GradioPlotlyChart: React.FC<GradioProps> = ({ api_endpoint }) => {
  const [plotData, setPlotData] = useState<PlotData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [plotLoaded, setPlotLoaded] = useState(false);

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const data = await fetchAPIData<PlotData>(api_endpoint);
        if (!data?.data) {
          throw new Error("Invalid plot data format");
        }
        setPlotData(data);
      } catch (err) {
        console.error("Error fetching plot data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlotData();
  }, [api_endpoint]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkPlotReady = () => {
      if (typeof Plot !== "undefined") {
        setPlotLoaded(true);
      } else {
        timeoutId = setTimeout(checkPlotReady, 100);
      }
    };

    checkPlotReady();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (loading || !plotLoaded) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!plotData) return <ErrorMessage message="No plot data available" />;

  plotData.layout.sliders[0]["y"] = -0.2;
  return (
    <div className="w-full" style={{ height: "max(min(425px, 47vw), 50vh)" }}>
      <Plot
        data={Array.isArray(plotData.data) ? plotData.data : [plotData.data]}
        layout={{
          autosize: true,
          ...plotData.layout,
          margin: { l: 0, r: 0, t: 50, b: 50 },
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

const LeaderboardEmbed: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Script
        src={PLOTLY_SCRIPT_URL}
        onError={(e) => {
          console.log("Failed to load Plotly script");
        }}
        onLoad={async () => {
          const createPlotlyComponent = (
            await import("react-plotly.js/factory")
          ).default;
          Plot = createPlotlyComponent(window.Plotly);
        }}
      />
      <GradioUpdateTime api_endpoint="update-time" />
      <GradioPlotlyChart api_endpoint="win-rate-plot" />
      <br />
      <GradioPlotlyChart api_endpoint="bt-plot" />
    </div>
  );
};

export default LeaderboardEmbed;
