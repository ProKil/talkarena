"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Task =
  | "Emotion Recognition"
  | "Language Detection"
  | "Intent Classification"
  | "Age Classification"
  | "Instruction Following"
  | "Speech QA"
  | "Accent Classification"
  | "Speech Grounding"
  | "Relation Classification"
  | "Gender Classification"
  | "Entity Recognition";

// Custom tooltip component
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-2 border rounded shadow-sm">
        <p className="font-medium">{data.Dataset}</p>
        <p className="text-sm">Task: {data.Task}</p>
        <p className="text-sm">
          Distance: {data.KendallTauDistance.toFixed(3)}
        </p>
      </div>
    );
  }
  return null;
};

type DataItem = {
  Dataset: string;
  KendallTauDistance: number;
  Task: Task;
  fill: string;
};

const data: DataItem[] = [
  {
    Dataset: "iemocap",
    KendallTauDistance: 0.08,
    Task: "Emotion Recognition",
    fill: "var(--color-emotion-recognition)",
  },
  {
    Dataset: "meld",
    KendallTauDistance: 0.08,
    Task: "Emotion Recognition",
    fill: "var(--color-emotion-recognition)",
  },
  {
    Dataset: "covost2",
    KendallTauDistance: 0.08,
    Task: "Language Detection",
    fill: "var(--color-language-detection)",
  },
  {
    Dataset: "slurp",
    KendallTauDistance: 0.12,
    Task: "Intent Classification",
    fill: "var(--color-intent-classification)",
  },
  {
    Dataset: "cvage",
    KendallTauDistance: 0.12,
    Task: "Age Classification",
    fill: "var(--color-age-classification)",
  },
  {
    Dataset: "alpaca",
    KendallTauDistance: 0.12,
    Task: "Instruction Following",
    fill: "var(--color-instruction-following)",
  },
  {
    Dataset: "sgspeech",
    KendallTauDistance: 0.1530306154330093,
    Task: "Speech QA",
    fill: "var(--color-speech-qa)",
  },
  {
    Dataset: "cvaccent",
    KendallTauDistance: 0.15999999999999998,
    Task: "Accent Classification",
    fill: "var(--color-accent-classification)",
  },
  {
    Dataset: "mutual",
    KendallTauDistance: 0.16,
    Task: "Speech QA",
    fill: "var(--color-speech-qa)",
  },
  {
    Dataset: "grounding",
    KendallTauDistance: 0.23999999999999996,
    Task: "Speech Grounding",
    fill: "var(--color-speech-grounding)",
  },
  {
    Dataset: "fsage",
    KendallTauDistance: 0.31999999999999995,
    Task: "Age Classification",
    fill: "var(--color-age-classification)",
  },
  {
    Dataset: "callhome",
    KendallTauDistance: 0.32,
    Task: "Relation Classification",
    fill: "var(--color-relation-classification)",
  },
  {
    Dataset: "openhermes",
    KendallTauDistance: 0.36,
    Task: "Instruction Following",
    fill: "var(--color-instruction-following)",
  },
  {
    Dataset: "fsgender",
    KendallTauDistance: 0.4,
    Task: "Gender Classification",
    fill: "var(--color-gender-classification)",
  },
  {
    Dataset: "urfunny",
    KendallTauDistance: 0.4087129070824723,
    Task: "Intent Classification",
    fill: "var(--color-intent-classification)",
  },
  {
    Dataset: "slurpent",
    KendallTauDistance: 0.44,
    Task: "Entity Recognition",
    fill: "var(--color-entity-recognition)",
  },
  {
    Dataset: "mustard",
    KendallTauDistance: 0.44,
    Task: "Intent Classification",
    fill: "var(--color-intent-classification)",
  },
  {
    Dataset: "cvgender",
    KendallTauDistance: 0.52,
    Task: "Gender Classification",
    fill: "var(--color-gender-classification)",
  },
] as const;

const uniqueTasks = data.reduce<Payload[]>((acc, item) => {
  if (!acc.some((task) => task.value === item.Task)) {
    acc.push({
      id: item.Task,
      value: item.Task,
      color: item.fill,
      type: "square",
    });
  }
  return acc;
}, []);

// Add type for legend payload
type LegendPayload = {
  id: string;
  value: string;
  color: string;
  type: string;
};

type CustomLegendProps = {
  payload?: Payload[];
};

const config: ChartConfig = {
  "emotion-recognition": {
    label: "Emotion Recognition",
    color: "hsl(var(--chart-1))",
  },
  "language-detection": {
    label: "Language Detection",
    color: "hsl(var(--chart-2))",
  },
  "intent-classification": {
    label: "Intent Classification",
    color: "hsl(var(--chart-3))",
  },
  "age-classification": {
    label: "Age Classification",
    color: "hsl(var(--chart-4))",
  },
  "instruction-following": {
    label: "Instruction Following",
    color: "hsl(var(--chart-5))",
  },
  "speech-qa": { label: "Speech QA", color: "hsl(var(--chart-5))" },
  "accent-classification": {
    label: "Accent Classification",
    color: "hsl(var(--chart-2))",
  },
  "speech-grounding": {
    label: "Speech Grounding",
    color: "hsl(var(--chart-5))",
  },
  "relation-classification": {
    label: "Relation Classification",
    color: "hsl(var(--chart-5))",
  },
  "gender-classification": {
    label: "Gender Classification",
    color: "hsl(var(--chart-4))",
  },
  "entity-recognition": {
    label: "Entity Recognition",
    color: "hsl(var(--chart-5))",
  },
};

const CustomLegend: React.FC<CustomLegendProps> = ({ payload = [] }) => {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm mt-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center">
          <div
            className="w-3 h-3 mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function KendallTauDistanceChart() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>
            Distance between Rankings on Static Datasets and Talk Arena
          </CardTitle>
          <CardDescription>
            Top-k Kendall Tau Ranking Distance (lower is better correlated)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={700}>
            <ChartContainer config={config}>
              <BarChart accessibilityLayer data={data}>
                <XAxis
                  dataKey="Dataset"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  dataKey="KendallTauDistance"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <Bar dataKey="KendallTauDistance" fillOpacity={0.8}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} payload={uniqueTasks} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
