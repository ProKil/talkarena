"use client";

import React, { useState, useEffect } from "react";
import { Noto_Sans } from "next/font/google";
import createPlotlyComponent from "react-plotly.js/factory";
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
const API_URL = "https://eead82ea9a6e1f5569.gradio.live";
const FETCH_TIMEOUT = 30000; // 30 seconds timeout
const PLOTLY_SCRIPT_URL = "https://cdn.plot.ly/plotly-2.35.2.min.js";

// Types
interface PlotData {
  data: any[];
  layout?: any;
  frames?: any[];
  config?: any;
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

const safeJSONParse = <T,>(str: string): T | null => {
  try {
    return JSON.parse(str) as T;
  } catch (e) {
    console.error("JSON Parse error:", e);
    return null;
  }
};

const processSSEResponse = async (response: Response): Promise<string> => {
  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += new TextDecoder().decode(value);
  }

  const lines = result.split("\n");
  const lastDataLine = lines
    .find((line) => line.startsWith("data: "))
    ?.slice(6);

  if (!lastDataLine) {
    throw new Error("No data found in response");
  }

  return lastDataLine;
};

const fetchGradioData = async <T,>(endpoint: string): Promise<T> => {
  const initialResponse = await fetchWithTimeout(
    `${API_URL}/gradio_api/call/${endpoint}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [] }),
    },
  );

  const initialJson = await initialResponse.json();
  if (!initialJson?.event_id) {
    throw new Error("Invalid response format");
  }

  const dataResponse = await fetchWithTimeout(
    `${API_URL}/gradio_api/call/${endpoint}/${initialJson.event_id}`,
  );

  const lastDataLine = await processSSEResponse(dataResponse);
  const dataList = safeJSONParse<GradioResponse<T>[]>(lastDataLine);

  const result = dataList?.[0]?.value ?? JSON.parse(typeof dataList?.[0] === 'string' ? dataList[0] : "{}");
  return result;
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
  const [timeData, setTimeData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const data = await fetchGradioData<string>(api_endpoint);
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
      <div
        className="text-center"
        dangerouslySetInnerHTML={{ __html: timeData }}
      />
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
        const data = await fetchGradioData<PlotData>(api_endpoint);
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

const scriptExists = (src: string): boolean => {
  return Array.from(document.getElementsByTagName("script")).some(
    (el): el is HTMLScriptElement =>
      el instanceof HTMLScriptElement && el.src === src,
  );
};

const LeaderboardEmbed: React.FC = () => {
  const [scriptError, setScriptError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!scriptExists(PLOTLY_SCRIPT_URL)) {
        const script = document.createElement("script");
        script.src = PLOTLY_SCRIPT_URL;
        script.charset = "utf-8";

        script.onerror = () => {
          setScriptError("Failed to load Plotly script");
        };

        script.onload = () => {
          Plot = createPlotlyComponent(window.Plotly);
        };

        document.head.appendChild(script);
      }
    } catch (err) {
      console.error("Error loading script:", err);
      setScriptError(
        err instanceof Error ? err.message : "Failed to initialize Plotly",
      );
    }
  }, []);

  if (scriptError) {
    return <ErrorMessage message={scriptError} />;
  }

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
