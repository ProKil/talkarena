"use client"; // For Next.js App Router

export default function TableWithInlineStyles() {
  // Define common styles as objects for reuse
  const tableStyle = {
    width: "min(1200px, 98vw)",
    marginLeft: "calc((100% - min(1200px, 98vw)) / 2)",
    borderCollapse: "collapse",
    fontFamily: "system-ui, -apple-system, sans-serif",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    overflow: "hidden",
  };

  const thStyle = {
    backgroundColor: "#f8fafc",
    padding: "12px 16px",
    fontWeight: "600",
    textAlign: "center",
    borderBottom: "2px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
  };

  const tdStyle = {
    padding: "12px 16px",
    textAlign: "center",
    borderBottom: "1px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
  };

  const categoryStyle = {
    backgroundColor: "black",
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    width: "160px",
    ...tdStyle,
  };

  const metricStyle = {
    textAlign: "left",
    fontWeight: "500",
    width: "250px",
    ...tdStyle,
  };

  const dataPointStyle = {
    ...tdStyle,
  };

  const highlightStyle = {
    fontWeight: "600",
    backgroundColor: "rgba(236, 253, 245, 0.4)",
    ...tdStyle,
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th colSpan={2}></th>
          <th style={thStyle}># Data Points</th>
          <th style={thStyle}>GPT-4o</th>
          <th style={thStyle}>GPT Pipeline</th>
          <th style={thStyle}>Gemini 2.0</th>
          <th style={{ ...thStyle, borderRight: "none" }}>Gemini 2.5</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={categoryStyle}>Latency</td>
          <td style={{ ...metricStyle, borderTop: "1px solid #e2e8f0" }}>
            Jeopardy (Win Rate % ↑)
          </td>
          <td style={dataPointStyle}>1k</td>
          <td style={highlightStyle}>73.00%</td>
          <td style={tdStyle}>15.40%</td>
          <td style={tdStyle}>6.00%</td>
          <td style={tdStyle}>No Speech Output</td>
        </tr>
        <tr>
          <td style={categoryStyle}>Function Calling</td>
          <td style={metricStyle}>Function Calling (Function Calls Match ↑)</td>
          <td style={dataPointStyle}>1k</td>
          <td style={tdStyle}>24%</td>
          <td style={highlightStyle}>27%</td>
          <td style={tdStyle}>N/A</td>
          <td style={tdStyle}>N/A</td>
        </tr>
        <tr>
          <td style={categoryStyle} rowSpan={2}>
            Instruction Following
          </td>
          <td style={metricStyle}>System Prompt Following (Adhere % ↑)</td>
          <td style={dataPointStyle}>1k</td>
          <td style={tdStyle}>64.6%</td>
          <td style={tdStyle}>64.7%</td>
          <td style={tdStyle}>69.7%</td>
          <td style={highlightStyle}>70.2%</td>
        </tr>
        <tr>
          <td style={metricStyle}>Pronunciation Control (OED % Correct ↑)</td>
          <td style={dataPointStyle}>283</td>
          <td style={highlightStyle}>58%</td>
          <td style={tdStyle}>45%</td>
          <td style={tdStyle}>32%</td>
          <td style={tdStyle}>No Speech Output</td>
        </tr>
        <tr>
          <td style={categoryStyle}>Tone Awareness</td>
          <td style={metricStyle}>
            Counterfactual Response (Likert Scale Score / 5 ↑)
          </td>
          <td style={dataPointStyle}>1.5k</td>
          <td style={highlightStyle}>3.37</td>
          <td style={tdStyle}>3.27</td>
          <td style={tdStyle}>3.3</td>
          <td style={tdStyle}>3.32</td>
        </tr>
        <tr>
          <td style={categoryStyle}>Turn-Taking</td>
          <td style={metricStyle}>Turn Prediction (Accuracy ↑)</td>
          <td style={dataPointStyle}>1k</td>
          <td style={tdStyle}>40.70%</td>
          <td style={tdStyle}>37.00%</td>
          <td style={tdStyle}>38.3</td>
          <td style={highlightStyle}>47.50%</td>
        </tr>
        <tr>
          <td style={categoryStyle} rowSpan={2}>
            Safety
          </td>
          <td style={metricStyle}>Deception Detection (Accuracy ↑)</td>
          <td style={dataPointStyle}>151</td>
          <td style={tdStyle}>[REFUSES]</td>
          <td style={tdStyle}>14.57%</td>
          <td style={highlightStyle}>26%</td>
          <td style={tdStyle}>12.58%</td>
        </tr>
        <tr>
          <td style={metricStyle}>Speech Jailbreaking (Success Rate ↓)</td>
          <td style={dataPointStyle}>520</td>
          <td style={tdStyle}>68.27%</td>
          <td style={tdStyle}>79.04%</td>
          <td style={tdStyle}>79.23%</td>
          <td style={highlightStyle}>49.04%</td>
        </tr>
      </tbody>
    </table>
  );
}
