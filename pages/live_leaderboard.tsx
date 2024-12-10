import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LatencyMetrics {
  time_to_first_token: number;
  total_time: number;
  response_length: number;
}

interface ComparisonData {
  model_a: string;
  model_b: string;
  outcome: number;
  model_a_latency?: LatencyMetrics;
  model_b_latency?: LatencyMetrics;
}

interface ApiResponse {
  _default: {
    [key: string]: ComparisonData;
  };
}

interface ModelStats {
  wins: number;
  losses: number;
  ties: number;
  total_games: number;
  first_token_total: number;
  total_time_total: number;
  response_length_total: number;
  comparison_count: number;
  bradley_terry_score: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  model_a: string;
  opponents: { 
    [key: string]: { 
      wins: number; 
      losses: number; 
      ties: number; 
      total: number 
    } 
  };
}

interface ModelPerformance {
  [key: string]: ModelStats;
}

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number = 0) {
    this.seed = seed;
  }

  // Implementation of xoshiro128** algorithm
  next(): number {
    let a = this.seed;
    let b = 362436069;
    let c = 521288629;
    let d = 88675123;
    
    const t = b << 9;
    const r = a * 5; 
    const result = ((r << 7) | (r >>> 25)) * 9;
    
    c = c ^ a;
    d = d ^ b;
    b = b ^ c;
    a = a ^ d;
    c = c ^ t;
    
    this.seed = a;
    return (result >>> 0) / 4294967296;
  }
}

const rng = new SeededRandom(0);

const logit = (x: number): number => Math.log(x / (1 - x));
const expit = (x: number): number => 1 / (1 + Math.exp(-x));

const btLossAndGrad = (
  ratings: number[],
  matchups: number[][],
  outcomes: number[],
  weights: number[],
  alpha: number = 1.0
): [number, number[]] => {
  const n = ratings.length;
  const matchupRatings = matchups.map(m => [ratings[m[0]], ratings[m[1]]]);
  const logits = matchupRatings.map((m, i) => alpha * (m[0] - m[1]));
  const probs = logits.map(expit);
  
  const loss = -weights.reduce((sum, w, i) => {
    const p = probs[i];
    const o = outcomes[i];
    return sum + w * (o * Math.log(p) + (1 - o) * Math.log(1 - p));
  }, 0);

  const modelGrad = new Array(n).fill(0);
  matchups.forEach((m, i) => {
    const grad = -alpha * (outcomes[i] - probs[i]) * weights[i];
    modelGrad[m[0]] += grad;
    modelGrad[m[1]] -= grad;
  });

  return [loss, modelGrad];
};

const lbfgsMinimize = (
  f: (x: number[]) => [number, number[]],
  x0: number[],
  maxIter: number = 100,
  tol: number = 1e-6
): number[] => {
  let x = [...x0];
  let prevLoss = Infinity;
  
  for (let iter = 0; iter < maxIter; iter++) {
    const [loss, grad] = f(x);
    const stepSize = 0.1;
    x = x.map((xi, i) => xi - stepSize * grad[i]);
    const mean = x.reduce((a, b) => a + b, 0) / x.length;
    x = x.map(xi => xi - mean);
    
    if (Math.abs(loss - prevLoss) < tol) break;
    prevLoss = loss;
  }
  
  return x;
};

const scaleAndOffset = (
  ratings: number[],
  models: string[],
  scale: number = 400,
  initRating: number = 1000,
  baselineModel: string = "pipe_l3.0",
  baselineRating: number = 1100
): number[] => {
  let scaledRatings = ratings.map(r => r * scale + initRating);
  
  const baselineIdx = models.indexOf(baselineModel);
  if (baselineIdx !== -1) {
    const offset = baselineRating - scaledRatings[baselineIdx];
    scaledRatings = scaledRatings.map(r => r + offset);
  }
  
  return scaledRatings;
};

const ModelPerformanceTable: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + 
          encodeURIComponent('https://raw.githubusercontent.com/SALT-NLP/talk-arena/refs/heads/main/live_votes.json');
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData: ApiResponse = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        setError(`${error.message} (${error.name})`);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const calculateBradleyTerryScores = (modelStats: ModelPerformance): void => {
    const models = Object.keys(modelStats);
    const n_models = models.length;
    const alpha = Math.log(10.0);

    interface MatchupOutcome {
      model_a_idx: number;
      model_b_idx: number;
      outcome: number;
      weight: number;
    }
    
    const matchupOutcomes: MatchupOutcome[] = [];
    Object.values(modelStats).forEach(modelA => {
      Object.entries(modelA.opponents).forEach(([modelB, record]) => {
        if (record.total > 0) {
          matchupOutcomes.push({
            model_a_idx: models.indexOf(modelA.model_a),
            model_b_idx: models.indexOf(modelB),
            outcome: (record.wins + record.ties * 0.5) / record.total,
            weight: record.total
          });
        }
      });
    });

    const matchups = matchupOutcomes.map(m => [m.model_a_idx, m.model_b_idx]);
    const outcomes = matchupOutcomes.map(m => m.outcome);
    const weights = matchupOutcomes.map(m => m.weight);

    const initialRatings = new Array(n_models).fill(0);
    
    const fitBradleyTerry = (bootWeights: number[]) => {
      const f = (x: number[]) => btLossAndGrad(x, matchups, outcomes, bootWeights, alpha);
      return lbfgsMinimize(f, initialRatings, 100, 1e-6);
    };

    const numBootstrapRounds = 100;
    const bootstrapResults: number[][] = [];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    for (let round = 0; round < numBootstrapRounds; round++) {
      const bootWeights = weights.map(w => {
        const p = w / totalWeight;
        const n = weights.length;
        return Math.max(0, n * p * rng.next());
      });
      
      const weightSum = bootWeights.reduce((a, b) => a + b, 0);
      const normalizedWeights = bootWeights.map(w => w / weightSum);
      
      const ratings = fitBradleyTerry(normalizedWeights);
      const scaledRatings = scaleAndOffset(ratings, models);
      bootstrapResults.push(scaledRatings);
    }

    models.forEach((model, i) => {
      const modelRatings = bootstrapResults.map(r => r[i]).sort((a, b) => a - b);
      const median = modelRatings[Math.floor(modelRatings.length / 2)];
      
      const lowerIndex = Math.floor(0.025 * modelRatings.length);
      const upperIndex = Math.floor(0.975 * modelRatings.length);
      
      modelStats[model].bradley_terry_score = median;
      modelStats[model].confidence_interval = {
        lower: modelRatings[lowerIndex],
        upper: modelRatings[upperIndex]
      };
    });
  };

  const modelPerformance = useMemo(() => {
    if (!data) return {};
    
    const performances: ModelPerformance = {};
    
    Object.values(data._default).forEach((comparison: ComparisonData) => {
      [comparison.model_a, comparison.model_b].forEach(model => {
        if (!performances[model]) {
          performances[model] = {
            wins: 0,
            losses: 0,
            ties: 0,
            total_games: 0,
            first_token_total: 0,
            total_time_total: 0,
            response_length_total: 0,
            comparison_count: 0,
            bradley_terry_score: 0,
            confidence_interval: { lower: 0, upper: 0 },
            model_a: model,
            opponents: {}
          };
        }
      });

      if (!performances[comparison.model_a].opponents[comparison.model_b]) {
        performances[comparison.model_a].opponents[comparison.model_b] = {
          wins: 0, losses: 0, ties: 0, total: 0
        };
      }
      if (!performances[comparison.model_b].opponents[comparison.model_a]) {
        performances[comparison.model_b].opponents[comparison.model_a] = {
          wins: 0, losses: 0, ties: 0, total: 0
        };
      }

      if (comparison.outcome === 0) {
        performances[comparison.model_a].wins++;
        performances[comparison.model_b].losses++;
        performances[comparison.model_a].opponents[comparison.model_b].wins++;
        performances[comparison.model_b].opponents[comparison.model_a].losses++;
      } else if (comparison.outcome === 1) {
        performances[comparison.model_b].wins++;
        performances[comparison.model_a].losses++;
        performances[comparison.model_b].opponents[comparison.model_a].wins++;
        performances[comparison.model_a].opponents[comparison.model_b].losses++;
      } else if (comparison.outcome === 0.5) {
        performances[comparison.model_a].ties++;
        performances[comparison.model_b].ties++;
        performances[comparison.model_a].opponents[comparison.model_b].ties++;
        performances[comparison.model_b].opponents[comparison.model_a].ties++;
      }

      performances[comparison.model_a].total_games++;
      performances[comparison.model_b].total_games++;
      performances[comparison.model_a].opponents[comparison.model_b].total++;
      performances[comparison.model_b].opponents[comparison.model_a].total++;

      if (comparison.model_a_latency) {
        performances[comparison.model_a].first_token_total += comparison.model_a_latency.time_to_first_token;
        performances[comparison.model_a].total_time_total += comparison.model_a_latency.total_time;
        performances[comparison.model_a].response_length_total += comparison.model_a_latency.response_length;
        performances[comparison.model_a].comparison_count++;
      }
      
      if (comparison.model_b_latency) {
        performances[comparison.model_b].first_token_total += comparison.model_b_latency.time_to_first_token;
        performances[comparison.model_b].total_time_total += comparison.model_b_latency.total_time;
        performances[comparison.model_b].response_length_total += comparison.model_b_latency.response_length;
        performances[comparison.model_b].comparison_count++;
      }
    });

    calculateBradleyTerryScores(performances);
    return performances;
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4 mx-auto"></div>
          <p>Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-50 text-red-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const sortedModels = Object.entries(modelPerformance)
    .sort(([, a], [, b]) => b.bradley_terry_score - a.bradley_terry_score);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Model Performance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border text-left font-semibold">Model</th>
                <th className="p-2 border text-right font-semibold">Bradley-Terry Score</th>
                <th className="p-2 border text-right font-semibold">Win Rate</th>
                <th className="p-2 border text-right font-semibold">Avg First Token (s)</th>
                <th className="p-2 border text-right font-semibold">Avg Total Time (s)</th>
                <th className="p-2 border text-right font-semibold">Avg Response Length</th>
              </tr>
            </thead>
            <tbody>
              {sortedModels.map(([model, stats]) => (
                <tr key={model}>
                  <td className="p-2 border">{model}</td>
                  <td className="p-2 border text-right">
                    {stats.bradley_terry_score.toFixed(1)} 
                  </td>
                  <td className="p-2 border text-right">
                    {((stats.wins + stats.ties * 0.5) / stats.total_games * 100).toFixed(1)}%
                  </td>
                  <td className="p-2 border text-right">
                    {(stats.first_token_total / stats.comparison_count).toFixed(2)}
                  </td>
                  <td className="p-2 border text-right">
                    {(stats.total_time_total / stats.comparison_count).toFixed(2)}
                  </td>
                  <td className="p-2 border text-right">
                    {Math.round(stats.response_length_total / stats.comparison_count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceTable;