import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Previous interfaces remain the same
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

// Update ModelStats to include confidence intervals
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

const ModelPerformanceTable: React.FC = () => {
  // ... Previous state declarations remain the same
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ... Previous useEffect remains the same
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
    const numModels = models.length;
    const base = 10.0;
    const scale = 400.0;
    const initRating = 1000.0;
    const tol = 1e-6;
    const numBootstrapRounds = 100;
    
    interface Battle {
      model_a: string;
      model_b: string;
      outcome: number;
      weight: number;
    }
    
    const battles: Battle[] = [];
    Object.values(modelStats).forEach(modelA => {
      Object.entries(modelA.opponents).forEach(([modelB, record]) => {
        const total = record.total;
        if (total > 0) {
          battles.push({
            model_a: modelA.model_a,
            model_b: modelB,
            outcome: (record.wins + record.ties * 0.5) / total,
            weight: total
          });
        }
      });
    });

    const fitBradleyTerry = (weights: number[]): number[] => {
      const ratings = new Array(numModels).fill(1.0);
      const alpha = Math.log(base);
      
      for (let iter = 0; iter < 1000; iter++) {
        const newRatings = new Array(numModels).fill(0.0);
        let maxDiff = 0;
        
        battles.forEach((battle, idx) => {
          const weight = weights[idx];
          if (weight === 0) return;
          
          const i = models.indexOf(battle.model_a);
          const j = models.indexOf(battle.model_b);
          const outcome = battle.outcome;
          
          const ri = ratings[i];
          const rj = ratings[j];
          const sum = ri + rj;
          
          newRatings[i] += weight * outcome / sum;
          newRatings[j] += weight * (1 - outcome) / sum;
        });
        
        const sum = newRatings.reduce((a, b) => a + b, 0);
        for (let i = 0; i < numModels; i++) {
          newRatings[i] = newRatings[i] * numModels / sum;
          maxDiff = Math.max(maxDiff, Math.abs(newRatings[i] - ratings[i]));
          ratings[i] = newRatings[i];
        }
        
        if (maxDiff < tol) break;
      }
      
      return ratings;
    };

    const totalWeight = battles.reduce((sum, b) => sum + b.weight, 0);
    const bootstrapResults: number[][] = [];
    
    for (let round = 0; round < numBootstrapRounds; round++) {
      const weights = battles.map(b => {
        const p = b.weight / totalWeight;
        const n = battles.length;
        const mean = n * p;
        const std = Math.sqrt(n * p * (1 - p));
        return Math.max(0, mean + std * Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()));
      });
      
      const weightSum = weights.reduce((a, b) => a + b, 0);
      const normalizedWeights = weights.map(w => w / weightSum);
      
      bootstrapResults.push(fitBradleyTerry(normalizedWeights));
    }

    // Calculate median and confidence intervals for each model
    models.forEach((model, modelIndex) => {
      const ratings = bootstrapResults.map(result => result[modelIndex]).sort((a, b) => a - b);
      const median = ratings[Math.floor(ratings.length / 2)];
      
      // Calculate 95% confidence interval indices
      const lowerIndex = Math.floor(0.025 * ratings.length);
      const upperIndex = Math.floor(0.975 * ratings.length);
      
      // Store raw interval bounds
      const lowerBound = ratings[lowerIndex];
      const upperBound = ratings[upperIndex];

      // Store for normalization
      modelStats[model].bradley_terry_score = median;
      modelStats[model].confidence_interval = {
        lower: lowerBound,
        upper: upperBound
      };
    });

    // Scale all scores and intervals
    const allValues = models.flatMap(model => [
      modelStats[model].bradley_terry_score,
      modelStats[model].confidence_interval.lower,
      modelStats[model].confidence_interval.upper
    ]);
    
    const minRating = Math.min(...allValues);
    const maxRating = Math.max(...allValues);
    
    models.forEach(model => {
      const normalizeValue = (value: number) => 
        initRating + scale * ((value - minRating) / (maxRating - minRating));

      modelStats[model].bradley_terry_score = normalizeValue(modelStats[model].bradley_terry_score);
      modelStats[model].confidence_interval = {
        lower: normalizeValue(modelStats[model].confidence_interval.lower),
        upper: normalizeValue(modelStats[model].confidence_interval.upper)
      };
    });
  };

  const modelPerformance = useMemo(() => {
    if (!data) return {};
    
    const performances: ModelPerformance = {};
    
    // Initialize model statistics
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

      // Initialize head-to-head records if needed
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

      // Update head-to-head records
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

      // Update total games and latency metrics
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
                <th className="p-2 border text-right font-semibold">Bradley-Terry Score (95% CI)</th>
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
                    <span className="text-gray-500 text-sm">
                      {" "}({stats.confidence_interval.lower.toFixed(1)} - {stats.confidence_interval.upper.toFixed(1)})
                    </span>
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