"use client"

import { FC, useMemo } from 'react';

interface ModelData {
  name: string;
  votes: number;
  percentage: number;
}

interface ComparisonData {
  model1: ModelData;
  model2: ModelData;
  tie: {
    votes: number;
    percentage: number;
  };
}

const ModelLabel: FC<{ name: string; votes: number }> = ({
  name,
  votes,
}) => (
  <div className="flex flex-col items-center w-full">
    <span className="font-medium text-sm leading-tight text-center">{name}</span>
    <span className="text-xs text-gray-600 text-center">({votes} votes)</span>
  </div>
);

const TieLabel: FC<{ votes: number }> = ({ votes }) => (
  <div className="flex flex-col items-center w-full">
    <span className="text-sm leading-tight text-center">Tie</span>
    <span className="text-xs text-gray-600 text-center">({votes})</span>
  </div>
);

interface ComparisonRowProps extends ComparisonData {}

const ComparisonRow: FC<ComparisonRowProps> = ({
  model1,
  model2,
  tie
}) => (
  <div className="w-full h-14 mb-1 last:mb-0">
    <div className="flex w-full h-full rounded-md overflow-hidden">
      {/* Model 1 Section */}
      <div 
        className="bg-red-100 flex items-center justify-center min-w-[120px] px-3"
        style={{ width: `${model1.percentage}%` }}
      >
        <ModelLabel 
          name={model1.name}
          votes={model1.votes}
        />
      </div>
      
      {/* Tie Section */}
      {tie.votes > 0 && (
        <div 
          className="bg-gray-100 flex items-center justify-center min-w-[60px] px-2"
          style={{ width: `${tie.percentage}%` }}
        >
          <TieLabel votes={tie.votes} />
        </div>
      )}
      
      {/* Model 2 Section */}
      <div 
        className="bg-yellow-50 flex items-center justify-center min-w-[120px] px-3"
        style={{ width: `${model2.percentage}%` }}
      >
        <ModelLabel 
          name={model2.name}
          votes={model2.votes}
        />
      </div>
    </div>
  </div>
);

const ModelComparisonChart: FC = () => {
  const rawData = useMemo(() => [
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

  const processedData = useMemo(() => 
    rawData.map(row => ({
      model1: {
        name: row.Model1,
        votes: row['Model1-Win'],
        percentage: (row['Model1-Win'] / row.total) * 100
      },
      model2: {
        name: row.Model2,
        votes: row['Model2-Win'],
        percentage: (row['Model2-Win'] / row.total) * 100
      },
      tie: {
        votes: row.Tie,
        percentage: (row.Tie / row.total) * 100
      }
    })),
    [rawData]
  );

  return (
    <div className="w-full max-w-4xl">
      {processedData.map((comparison, index) => (
        <ComparisonRow 
          key={`${comparison.model1.name}-${comparison.model2.name}`}
          {...comparison}
        />
      ))}
    </div>
  );
};

export default ModelComparisonChart;
