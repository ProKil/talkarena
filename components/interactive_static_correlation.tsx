"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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

type TaskColors = {
  [key in Task]: string;
};

type DataItem = {
    Dataset: string;
    KendallTauDistance: number;
    Task: Task;
    fill: string;
  };
  
const data: DataItem[] = [
    { Dataset: "iemocap", KendallTauDistance: 0.08, Task: "Emotion Recognition", fill: "var(--color-emotion-recognition)" },
    { Dataset: "meld", KendallTauDistance: 0.08, Task: "Emotion Recognition", fill: "var(--color-emotion-recognition)" },
    { Dataset: "covost2", KendallTauDistance: 0.08, Task: "Language Detection", fill: "var(--color-language-detection)" },
    { Dataset: "slurp", KendallTauDistance: 0.12, Task: "Intent Classification", fill: "var(--color-intent-classification)" },
    { Dataset: "cvage", KendallTauDistance: 0.12, Task: "Age Classification", fill: "var(--color-age-classification)" },
    { Dataset: "alpaca", KendallTauDistance: 0.12, Task: "Instruction Following", fill: "var(--color-instruction-following)" },
    { Dataset: "sgspeech", KendallTauDistance: 0.1530306154330093, Task: "Speech QA", fill: "var(--color-speech-qa)" },
    { Dataset: "cvaccent", KendallTauDistance: 0.15999999999999998, Task: "Accent Classification", fill: "var(--color-accent-classification)" },
    { Dataset: "mutual", KendallTauDistance: 0.16, Task: "Speech QA", fill: "var(--color-speech-qa)" },
    { Dataset: "grounding", KendallTauDistance: 0.23999999999999996, Task: "Speech Grounding", fill: "var(--color-speech-grounding)" },
    { Dataset: "fsage", KendallTauDistance: 0.31999999999999995, Task: "Age Classification", fill: "var(--color-age-classification)" },
    { Dataset: "callhome", KendallTauDistance: 0.32, Task: "Relation Classification", fill: "var(--color-relation-classification)" },
    { Dataset: "openhermes", KendallTauDistance: 0.36, Task: "Instruction Following", fill: "var(--color-instruction-following)" },
    { Dataset: "fsgender", KendallTauDistance: 0.4, Task: "Gender Classification", fill: "var(--color-gender-classification)" },
    { Dataset: "urfunny", KendallTauDistance: 0.4087129070824723, Task: "Intent Classification", fill: "var(--color-intent-classification)" },
    { Dataset: "slurpent", KendallTauDistance: 0.44, Task: "Entity Recognition", fill: "var(--color-entity-recognition)" },
    { Dataset: "mustard", KendallTauDistance: 0.44, Task: "Intent Classification", fill: "var(--color-intent-classification)" },
    { Dataset: "cvgender", KendallTauDistance: 0.52, Task: "Gender Classification", fill: "var(--color-gender-classification)" },
] as const;

// const taskColors: TaskColors = {
//   "Emotion Recognition": "hsl(var(--chart-1))",
//   "Language Detection": "hsl(var(--chart-2))",
//   "Intent Classification": "hsl(var(--chart-3))",
//   "Age Classification": "hsl(var(--chart-4))",
//   "Instruction Following": "hsl(var(--chart-5))",
//   "Speech QA": "hsl(var(--chart-6))",
//   "Accent Classification": "hsl(var(--chart-7))",
//   "Speech Grounding": "hsl(var(--chart-8))",
//   "Relation Classification": "hsl(var(--chart-9))",
//   "Gender Classification": "hsl(var(--chart-10))",
//   "Entity Recognition": "hsl(var(--chart-11))"
// }

const config: ChartConfig = {
    KendallTauDistance: { label: "Kendall Tau Distance" },
    "emotion-recognition": { label: "Emotion Recognition", color: "var(--chart-1)" },
    "language-detection": { label: "Language Detection", color: "var(--chart-2)" },
    "intent-classification": { label: "Intent Classification", color: "var(--chart-3)" },
    "age-classification": { label: "Age Classification", color: "var(--chart-4)" },
    "instruction-following": { label: "Instruction Following", color: "var(--chart-5)" },
    "speech-qa": { label: "Speech QA", color: "var(--chart-6)" },
    "accent-classification": { label: "Accent Classification", color: "var(--chart-7)" },
    "speech-grounding": { label: "Speech Grounding", color: "var(--chart-8)" },
    "relation-classification": { label: "Relation Classification", color: "var(--chart-9)" },
    "gender-classification": { label: "Gender Classification", color: "var(--chart-10)" },
    "entity-recognition": { label: "Entity Recognition", color: "var(--chart-11)" },
};



export default function KendallTauDistanceChart() {
    return (
        <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Correlation between static datasets and Talk Arena</CardTitle>
                <CardDescription>Kendall Tau Rank Distance (lower is better correlated)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={config}
                >
                <BarChart
                    accessibilityLayer
                    data={data}
                ></BarChart>

            </ChartContainer>
          </CardContent>
        </Card>
        </div>
      )
    }