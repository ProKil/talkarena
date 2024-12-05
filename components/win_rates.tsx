"use client"

import { FC, useMemo } from 'react';

type ModelName = 'DiVA' | 'Gemini' | 'GPT4o' | 'Qwen2' | 'Typhoon';

interface ModelMetrics {
  name: string;
  votes: number;
  percentage: number;
}

interface ComparisonMetrics {
  model1: ModelMetrics;
  model2: ModelMetrics;
  tie: {
    votes: number;
    percentage: number;
  };
  totalVotes: number;
}

interface RawComparison {
  Model1: ModelName;
  Model2: ModelName;
  'Model1-Win': number;
  'Model2-Win': number;
  Tie: number;
  total: number;
}

const COMPARISON_COLORS = {
  model1: '#B83A4B', // Updated custom red
  tie: '#53565A',    // Custom grey
  model2: '#4298B5'  // Custom blue
} as const;

const ROTATION_THRESHOLD = 15;

interface LabelProps {
  name: string;
  votes: number;
}

const ModelLabel: FC<LabelProps> = ({ name, votes, percentage }) => {
  const shouldRotate = percentage < ROTATION_THRESHOLD;
  
  return (
    <div className={`flex flex-col items-center w-full text-white ${shouldRotate ? 'writing-mode-vertical' : ''}`}>
      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-lr;
          text-orientation: mixed;
          transform: rotate(180deg);
          white-space: nowrap;
        }
      `}</style>
      <span className="font-medium text-sm leading-tight text-center">{name}</span>
      <span className="text-xs opacity-90 text-center">({votes})</span>
    </div>
  );
};

const TieLabel: FC<Pick<LabelProps, 'votes' | 'percentage'>> = ({ votes, percentage }) => {
  const shouldRotate = percentage < ROTATION_THRESHOLD;
  
  return (
    <div className={`flex flex-col items-center w-full text-white ${shouldRotate ? 'writing-mode-vertical' : ''}`}>
      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-lr;
          text-orientation: mixed;
          transform: rotate(180deg);
          white-space: nowrap;
        }
      `}</style>
      <span className="text-sm leading-tight text-center">Tie</span>
      <span className="text-xs opacity-90 text-center">({votes})</span>
    </div>
  );
};

interface ComparisonRowProps extends ComparisonMetrics {}

const ComparisonRow: FC<ComparisonRowProps> = ({
  model1,
  model2,
  tie
}) => (
  <div className="w-full h-14 mb-1 last:mb-0">
    <div className="flex w-full h-full rounded-md overflow-hidden">
      <div 
        style={{ 
          width: `${model1.percentage}%`,
          backgroundColor: COMPARISON_COLORS.model1,
        }}
        className="flex items-center justify-center px-3"
      >
        <ModelLabel 
          name={model1.name}
          votes={model1.votes}
        />
      </div>
      
      {tie.votes > 0 && (
        <div 
          style={{ 
            width: `${tie.percentage}%`,
            backgroundColor: COMPARISON_COLORS.tie,
          }}
          className="flex items-center justify-center px-2"
        >
          <TieLabel votes={tie.votes} />
        </div>
      )}
      
      <div 
        style={{ 
          width: `${model2.percentage}%`,
          backgroundColor: COMPARISON_COLORS.model2,
        }}
        className="flex items-center justify-center px-3"
      >
        <ModelLabel 
          name={model2.name}
          votes={model2.votes}
        />
      </div>
    </div>
  </div>
);

const MODEL_ORDER: ReadonlyArray<ModelName> = ['DiVA', 'GPT4o', 'Gemini', 'Qwen2', 'Typhoon'] as const;

const ModelComparisonChart: FC = () => {
  const rawData: readonly RawComparison[] = useMemo(() => [
  {
    "Model1": "DiVA",
    "Model2": "GPT4o",
    "Model1-Win": 252,
    "Model2-Win": 176,
    "Tie": 72,
    "total": 500,
    "winRate": 0.576,
    "confidenceInterval": [
      0.536,
      0.616
    ],
    "pValue": 0.0001,
    "significant": true
  },
  {
    "Model1": "DiVA",
    "Model2": "Gemini",
    "Model1-Win": 313,
    "Model2-Win": 130,
    "Tie": 57,
    "total": 500,
    "winRate": 0.683,
    "confidenceInterval": [
      0.644,
      0.721
    ],
    "pValue": 0,
    "significant": true
  },
  {
    "Model1": "DiVA",
    "Model2": "Qwen2",
    "Model1-Win": 322,
    "Model2-Win": 103,
    "Tie": 75,
    "total": 500,
    "winRate": 0.719,
    "confidenceInterval": [
      0.683,
      0.754
    ],
    "pValue": 0,
    "significant": true
  },
  {
    "Model1": "GPT4o",
    "Model2": "Gemini",
    "Model1-Win": 186,
    "Model2-Win": 213,
    "Tie": 101,
    "total": 500,
    "winRate": 0.527,
    "confidenceInterval": [
      0.488,
      0.566
    ],
    "pValue": 0.088,
    "significant": false
  },
  {
    "Model1": "GPT4o",
    "Model2": "Qwen2",
    "Model1-Win": 254,
    "Model2-Win": 155,
    "Tie": 91,
    "total": 500,
    "winRate": 0.401,
    "confidenceInterval": [
      0.363,
      0.44
    ],
    "pValue": 0,
    "significant": true
  },
  {
    "Model1": "Gemini",
    "Model2": "Qwen2",
    "Model1-Win": 255,
    "Model2-Win": 171,
    "Tie": 74,
    "total": 500,
    "winRate": 0.416,
    "confidenceInterval": [
      0.376,
      0.456
    ],
    "pValue": 0,
    "significant": true
  },
  {
    "Model1": "Typhoon",
    "Model2": "DiVA",
    "Model1-Win": 50,
    "Model2-Win": 417,
    "Tie": 33,
    "total": 500,
    "winRate": 0.867,
    "confidenceInterval": [
      0.839,
      0.894
    ],
    "pValue": 0,
    "significant": true
  },
  {
    "Model1": "Typhoon",
    "Model2": "GPT4o",
    "Model1-Win": 19,
    "Model2-Win": 447,
    "Tie": 34,
    "total": 500,
    "winRate": 0.928,
    "confidenceInterval": [
      0.908,
      0.947
    ],
    "pValue": 0,
    "significant": true
  },
  {
    "Model1": "Typhoon",
    "Model2": "Gemini",
    "Model1-Win": 50,
    "Model2-Win": 424,
    "Tie": 26,
    "total": 500,
    "winRate": 0.874,
    "confidenceInterval": [
      0.846,
      0.9
    ],
    "pValue": 0,
    "significant": true
  },
  {
    "Model1": "Typhoon",
    "Model2": "Qwen2",
    "Model1-Win": 82,
    "Model2-Win": 347,
    "Tie": 71,
    "total": 500,
    "winRate": 0.765,
    "confidenceInterval": [
      0.732,
      0.797
    ],
    "pValue": 0,
    "significant": true
  }
] as const, []);

  const processedData = useMemo(() => {
    const processed = rawData.map(row => ({
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
      },
      totalVotes: row.total
    }));

    return processed.sort((a, b) => {
      const aIndex1 = MODEL_ORDER.indexOf(a.model1.name as ModelName);
      const aIndex2 = MODEL_ORDER.indexOf(a.model2.name as ModelName);
      const bIndex1 = MODEL_ORDER.indexOf(b.model1.name as ModelName);
      const bIndex2 = MODEL_ORDER.indexOf(b.model2.name as ModelName);
      
      if (aIndex1 !== bIndex1) return aIndex1 - bIndex1;
      return aIndex2 - bIndex2;
    });
  }, [rawData]);

  return (
    <div className="w-full max-w-4xl">
      {processedData.map((comparison) => (
        <ComparisonRow 
          key={`${comparison.model1.name}-${comparison.model2.name}`}
          {...comparison}
        />
      ))}
    </div>
  );
};

export default ModelComparisonChart;
