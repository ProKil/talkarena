"use client"; // For Next.js App Router

import React from "react";

// Define TypeScript interfaces for styles
interface BaseStyle {
  [key: string]: string | number;
}

interface TableStyles {
  tableStyle: BaseStyle;
  thStyle: BaseStyle;
  tdStyle: BaseStyle;
  categoryStyle: BaseStyle;
  metricStyle: BaseStyle;
  dataPointStyle: BaseStyle;
  highlightStyle: BaseStyle;
}

// Define interfaces for table data
interface ModelScore {
  value: string;
  isHighlighted?: boolean;
}

interface MetricRow {
  category: string;
  metric: string;
  dataPoints: string;
  scores: {
    gpt4o: ModelScore;
    gptPipeline: ModelScore;
    gemini20: ModelScore;
    gemini25: ModelScore;
  };
  rowSpan?: number;
}

export default function TableWithTypedStyles(): JSX.Element {
  // Define common styles as objects for reuse
  const styles: TableStyles = {
    tableStyle: {
      width: "min(1000px, 98vw)",
      //marginLeft: "calc((100% - min(1200px, 98vw)))",
      overflow: "hidden",
    },

    thStyle: {
      backgroundColor: "#f8fafc",
      padding: "12px 16px",
      fontWeight: "600",
      textAlign: "center",
    },

    tdStyle: {
      padding: "12px 16px",
      textAlign: "center",
    },

    categoryStyle: {
      backgroundColor: "black",
      color: "white",
      fontWeight: "600",
      textAlign: "center",
      width: "160px",
    },

    metricStyle: {
      textAlign: "left",
      fontWeight: "500",
      width: "250px",
    },

    dataPointStyle: {},

    highlightStyle: {
      fontWeight: "600",
      backgroundColor: "#8AB8A7",
    },
  };

  // Apply tdStyle to these objects
  styles.categoryStyle = { ...styles.tdStyle, ...styles.categoryStyle };
  styles.metricStyle = { ...styles.tdStyle, ...styles.metricStyle };
  styles.dataPointStyle = { ...styles.tdStyle };
  styles.highlightStyle = { ...styles.tdStyle, ...styles.highlightStyle };

  // Define the table data
  const tableData: MetricRow[] = [
    {
      category: "Latency",
      metric: "Jeopardy (Win Rate % ↑)",
      dataPoints: "1k",
      scores: {
        gpt4o: { value: "73.00%", isHighlighted: true },
        gptPipeline: { value: "15.40%" },
        gemini20: { value: "6.00%" },
        gemini25: { value: "No Speech Output" },
      },
    },
    {
      category: "Function Calling",
      metric: "Function Calling (Function Calls Match ↑)",
      dataPoints: "1k",
      scores: {
        gpt4o: { value: "24%" },
        gptPipeline: { value: "27%", isHighlighted: true },
        gemini20: { value: "N/A" },
        gemini25: { value: "N/A" },
      },
    },
    {
      category: "Instruction Following",
      metric: "System Prompt Following (Adhere % ↑)",
      dataPoints: "1k",
      scores: {
        gpt4o: { value: "64.6%" },
        gptPipeline: { value: "64.7%" },
        gemini20: { value: "69.7%" },
        gemini25: { value: "70.2%", isHighlighted: true },
      },
      rowSpan: 2,
    },
    {
      category: "Instruction Following",
      metric: "Pronunciation Control (OED % Correct ↑)",
      dataPoints: "283",
      scores: {
        gpt4o: { value: "58%", isHighlighted: true },
        gptPipeline: { value: "45%" },
        gemini20: { value: "32%" },
        gemini25: { value: "No Speech Output" },
      },
    },
    {
      category: "Tone Awareness",
      metric: "Counterfactual Response (Likert Scale Score / 5 ↑)",
      dataPoints: "1.5k",
      scores: {
        gpt4o: { value: "3.37", isHighlighted: true },
        gptPipeline: { value: "3.27" },
        gemini20: { value: "3.30" },
        gemini25: { value: "3.32" },
      },
    },
    {
      category: "Turn-Taking",
      metric: "Turn Prediction (Accuracy ↑)",
      dataPoints: "1k",
      scores: {
        gpt4o: { value: "40.70%" },
        gptPipeline: { value: "37.00%" },
        gemini20: { value: "38.3" },
        gemini25: { value: "47.50%", isHighlighted: true },
      },
    },
    {
      category: "Safety",
      metric: "Deception Detection (Accuracy ↑)",
      dataPoints: "151",
      scores: {
        gpt4o: { value: "[REFUSES]" },
        gptPipeline: { value: "14.5%" },
        gemini20: { value: "26.1%", isHighlighted: true },
        gemini25: { value: "12.5%" },
      },
      rowSpan: 2,
    },
    {
      category: "Safety",
      metric: "Speech Jailbreaking (Success Rate ↓)",
      dataPoints: "520",
      scores: {
        gpt4o: { value: "68.3%" },
        gptPipeline: { value: "79.0%" },
        gemini20: { value: "79.2%" },
        gemini25: { value: "49.0%", isHighlighted: true },
      },
    },
  ];

  // Create a map to track row spans
  const categoryRowSpans: Record<string, boolean> = {};

  return (
    <table style={styles.tableStyle}>
      <thead>
        <tr>
          <th style={styles.thStyle}>Category</th>
          <th style={styles.thStyle}>Task</th>
          <th style={styles.thStyle}># Data Points</th>
          <th style={styles.thStyle}>GPT-4o</th>
          <th style={styles.thStyle}>GPT Pipeline</th>
          <th style={styles.thStyle}>Gemini 2.0</th>
          <th style={styles.thStyle}>Gemini 2.5</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, rowIndex) => {
          // Should we render the category cell?
          const renderCategory = !categoryRowSpans[row.category];

          // If this row has a rowSpan, mark this category as spanned
          if (row.rowSpan && row.rowSpan > 1) {
            categoryRowSpans[row.category] = true;
          }

          return (
            <tr key={`${row.category}-${row.metric}`}>
              {renderCategory ? (
                <td style={styles.categoryStyle} rowSpan={row.rowSpan || 1}>
                  {row.category}
                </td>
              ) : null}
              <td style={styles.metricStyle}>{row.metric}</td>
              <td style={styles.dataPointStyle}>{row.dataPoints}</td>
              <td
                style={
                  row.scores.gpt4o.isHighlighted
                    ? styles.highlightStyle
                    : styles.tdStyle
                }
              >
                {row.scores.gpt4o.value}
              </td>
              <td
                style={
                  row.scores.gptPipeline.isHighlighted
                    ? styles.highlightStyle
                    : styles.tdStyle
                }
              >
                {row.scores.gptPipeline.value}
              </td>
              <td
                style={
                  row.scores.gemini20.isHighlighted
                    ? styles.highlightStyle
                    : styles.tdStyle
                }
              >
                {row.scores.gemini20.value}
              </td>
              <td
                style={
                  row.scores.gemini25.isHighlighted
                    ? styles.highlightStyle
                    : styles.tdStyle
                }
              >
                {row.scores.gemini25.value}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
