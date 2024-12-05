"use client"

import { FC, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type ModelComparison = {
  Model1: string;
  Model2: string;
  'Model1-Win': number;
  'Model2-Win': number;
  Tie: number;
  total: number;
};

type ProcessedComparison = {
  model1Name: string;
  model2Name: string;
  model1Votes: number;
  model2Votes: number;
  model1Width: number;
  model2Width: number;
};

const ComparisonRow: FC<ProcessedComparison> = ({
  model1Name,
  model2Name,
  model1Votes,
  model2Votes,
  model1Width,
  model2Width,
}) => (
  <div className="w-full mb-2">
    <div className="flex w-full rounded-lg overflow-hidden">
      <div 
        className="bg-red-100 flex items-center justify-between px-4 py-3"
        style={{ width: `${model1Width}%` }}
      >
        <div className="text-gray-600">
          <div className="font-medium">{model1Name}</div>
          <div className="text-sm">({model1Votes} votes)</div>
        </div>
      </div>
      <div 
        className="bg-yellow-50 flex items-center justify-between px-4 py-3"
        style={{ width: `${model2Width}%` }}
      >
        <div className="text-gray-600 ml-auto">
          <div className="font-medium">{model2Name}</div>
          <div className="text-sm">({model2Votes} votes)</div>
        </div>
      </div>
    </div>
  </div>
);

const ModelComparisonChart: FC = () => {
  const rawData: ModelComparison[] = useMemo(() => [
    { Model1: 'Qwen2', Model2: 'Diva', 'Model1-Win': 103, 'Model2-Win': 322, Tie: 75, total: 500 },
    { Model1: 'Gemini', Model2: 'Diva', 'Model1-Win': 130, 'Model2-Win': 313, Tie: 57, total: 500 },
    { Model1: 'Gemini', Model2: 'Qwen2', 'Model1-Win': 255, 'Model2-Win': 171, Tie: 74, total: 500 },
    { Model1: 'Gpt4o', Model2: 'Qwen2', 'Model1-Win': 254, 'Model2-Win': 155, Tie: 91, total: 500 },
    { Model1: 'Gpt4o', Model2: 'Diva', 'Model1-Win': 176, 'Model2-Win': 252, Tie: 72, total: 500 },
    { Model1: 'Gpt4o', Model2: 'Gemini', 'Model1-Win': 186, 'Model2-Win': 213, Tie: 101, total: 500 },
    { Model1: 'Typhoon', Model2: 'Qwen2', 'Model1-Win': 82, 'Model2-Win': 347, Tie: 71, total: 500 },
    { Model1: 'Typhoon', Model2: 'Diva', 'Model1-Win': 50, 'Model2-Win': 417, Tie: 33, total: 500 },
    { Model1: 'Typhoon', Model2: 'Gemini', 'Model1-Win': 50, 'Model2-Win': 424, Tie: 26, total: 500 },
    { Model1: 'Typhoon', Model2: 'GPT4o', 'Model1-Win': 19, 'Model2-Win': 447, Tie: 34, total: 500 }
  ], []);

  const processedData = useMemo(() => {
    return rawData.map(row => {
      const model1Votes = row['Model1-Win'] + row.Tie / 2;
      const model2Votes = row['Model2-Win'] + row.Tie / 2;
      const totalEffectiveVotes = model1Votes + model2Votes;
      
      return {
        model1Name: row.Model1,
        model2Name: row.Model2,
        model1Votes: Number(model1Votes.toFixed(1)),
        model2Votes: Number(model2Votes.toFixed(1)),
        model1Width: (model1Votes / totalEffectiveVotes) * 100,
        model2Width: (model2Votes / totalEffectiveVotes) * 100,
      };
    });
  }, [rawData]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-2">
          {processedData.map((comparison, index) => (
            <ComparisonRow 
              key={`${comparison.model1Name}-${comparison.model2Name}`}
              {...comparison}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelComparisonChart;
