"use client";

import React, { useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const csvData = `Model,Urfunny (Humor Detection),Mustard (Sarcasm Detection),SLURP (Intent Detection),IEMOCAP (Emotion Recognition),MELD (Emotion Recognition),Public_SG_Speech (Speech QA),CN_College_Listen (Speech QA),Librispeech (Speech Grounding),SLURP (Entity Recognition),Callhome (Relation Classification),Commonvoice (Gender Classification),FairSpeech (Gender Classification),Commonvoice (Age Classification),FairSpeech (Age Classification),Commonvoice (Accent Classification),Covost2 (Language Classification),Openhermes (Instruction Following),Alpaca (Instruction Following),Overall
NextGPT,26.6,16.9,12.7,11.5,5.7,55.3,20.5,8.7,12.2,27.4,17.9,30.2,7,9.9,6.8,26.4,7,5.9,17.1
PandaGPT,42.6,33.4,13.9,16.4,5.8,53.6,25.3,8.7,17.6,44.2,26.4,58.5,11.5,11.9,4,33.5,27.3,24,25.5
SpeechGPT,29.5,27.2,18.4,16.6,6.1,56,19.6,7.5,13.9,17.3,22.1,29.4,11,11.4,1.8,30.8,51.5,50,23.3
SALMONN,39.2,34.6,35.5,22.7,9.7,69.4,32.9,18,28.3,31.7,12.8,20.8,2.9,8.3,3.3,20.3,43.9,32.2,25.9
Qwen-audio,39.9,30.8,69.1,21.2,11.6,75.7,44.9,5,38.7,30.9,48,43,4.2,12.5,5,58.1,50.3,40.8,35.0
Diva,46.2,38.3,61.5,26.4,23.9,64.2,36.9,17.3,18.8,34.9,31.1,29.9,7.3,13.6,13,46.5,66.2,67,35.7
Qwen2-audio,34.9,41.5,81.1,26.7,19.6,68.8,55.7,10,43.7,17.3,79.8,58.3,10.3,14.3,5.4,66.5,64,61.3,42.2
Gemini,35.7,36,91.4,27.5,26.9,62.3,66.1,25.9,23.6,35.9,38.3,49.5,5.6,10.1,24.5,68.8,56,62.3,41.5
GPT4o,44.6,53.6,89.2,31.5,26.6,64.4,65.9,22.2,35.8,59.7,18,9.1,9.1,15.4,35.3,73.3,63.7,64.2,43.4
Whisper+llama3,37.8,32.8,64.8,25.2,22.8,50.3,62.6,20.4,16.5,22.8,30.1,32.6,9.7,12.9,13.9,50.4,45.9,44.9,33.1
Typhoon,44.6,48.8,45.3,25,18.1,62.3,42.8,22.1,38.5,44.2,74.4,36.3,5,18.1,7.9,36.4,69.4,67.1,39.2`;

const csvMetrics = `Model,Urfunny (Humor Detection),Mustard (Sarcasm Detection),SLURP (Intent Detection),IEMOCAP (Emotion Recognition),MELD (Emotion Recognition),Public_SG_Speech (Speech QA),CN_College_Listen (Speech QA),Librispeech (Speech Grounding),SLURP (Entity Recognition),Callhome (Relation Classification),Commonvoice (Gender Classification),FairSpeech (Gender Classification),Commonvoice (Age Classification),FairSpeech (Age Classification),Commonvoice (Accent Classification),Covost2 (Language Classification),Openhermes (Instruction Following),Alpaca (Instruction Following),Overall
Metric,Macro F1,Macro F1,Macro F1,Macro F1,Macro F1,PEDANTS,Macro F1,Macro F1,Macro F1,Macro F1,Macro F1,Macro F1,Macro F1,Macro F1,Macro F1,Macro F1,PEDANTS,PEDANTS,Score`;

const parseCSV = (csv: string) => {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  const data = lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj: { [key: string]: string | number } = { Model: values[0] };
    headers.slice(1).forEach((header, index) => {
      obj[header] = parseFloat(values[index + 1]);
    });
    return obj;
  });
  return { headers: headers.slice(1), data };
};

const parseMetrics = (csv: string) => {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  const data = lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj: { [key: string]: string | number } = { Model: values[0] };
    headers.slice(1).forEach((header, index) => {
      obj[header] = values[index + 1];
    });
    return obj;
  });
  return { headers: headers.slice(1), data };
};

const { data: metrics } = parseMetrics(csvMetrics);

const { headers, data } = parseCSV(csvData);

const colorPalette = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
  "hsl(var(--chart-11))",
];

export default function ModelPerformanceChart() {
  const [selectedDataset, setSelectedDataset] = useState("Overall");

  const sortedChartData = useMemo(() => {
    return data
      .map((item) => ({
        Model: item.Model,
        Performance: item[selectedDataset] as number,
      }))
      .sort((a, b) => -a.Performance + b.Performance);
  }, [selectedDataset]);

  const config = useMemo(() => {
    return sortedChartData.reduce(
      (acc, item, index) => {
        acc[item.Model as string] = {
          label: item.Model as string,
          color: colorPalette[index % colorPalette.length],
        };
        return acc;
      },
      {} as { [key: string]: { label: string; color: string } },
    );
  }, [sortedChartData]);

  const metric = useMemo(() => {
    return metrics[0][selectedDataset];
  }, [selectedDataset]);

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Model Performance on Static Benchmarks</CardTitle>
          <CardDescription>
            Performance across different datasets (ranked from highest to
            lowest)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-center">
            <Select
              value={selectedDataset}
              defaultValue="Overall"
              onValueChange={(value) => setSelectedDataset(value)}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a dataset" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ChartContainer config={config}>
            <BarChart
              accessibilityLayer
              data={sortedChartData}
              layout="vertical"
              margin={{ right: 24 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" />
              <YAxis
                dataKey="Model"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Legend />
              <Bar
                dataKey="Performance"
                fill={"hsl(var(--chart-1))"}
                name={metric}
              >
                <LabelList
                  dataKey="Model"
                  position="insideLeft"
                  offset={8}
                  className="fill-[hsl(var(--background))]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="Performance"
                  position="right"
                  offset={8}
                  className="fill-[hsl(var(--primary))]"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
