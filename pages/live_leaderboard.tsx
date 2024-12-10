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
  // Track head-to-head records
  opponents: { [key: string]: { wins: number; losses: number; ties: number; total: number } };
}

interface ModelPerformance {
  [key: string]: ModelStats;
}

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
    const iterations = 1000;
    const models = Object.keys(modelStats);
    const epsilon = 1e-6;  // Convergence threshold
    
    // Initialize all scores to 1.0
    models.forEach(model => {
      modelStats[model].bradley_terry_score = 1.0;
    });

    // Iterative calculation
    for (let iter = 0; iter < iterations; iter++) {
      let maxChange = 0;
      const newScores: { [key: string]: number } = {};
      
      models.forEach(model => {
        let numerator = 0;
        let denominator = 0;
        
        // Sum over all opponents
        Object.entries(modelStats[model].opponents).forEach(([opponent, record]) => {
          const wins = record.wins + (record.ties * 0.5);
          const games = record.total;
          
          if (games > 0) {
            numerator += wins;
            denominator += games / (modelStats[model].bradley_terry_score + modelStats[opponent].bradley_terry_score);
          }
        });

        // Calculate new score
        const newScore = numerator > 0 ? numerator / denominator : 0;
        newScores[model] = newScore;
        
        // Track maximum change for convergence check
        const change = Math.abs(newScore - modelStats[model].bradley_terry_score);
        maxChange = Math.max(maxChange, change);
      });

      // Update scores
      models.forEach(model => {
        modelStats[model].bradley_terry_score = newScores[model];
      });

      // Check for convergence
      if (maxChange < epsilon) break;
    }

    // Normalize scores to sum to number of models
    const totalScore = Object.values(modelStats).reduce((sum, stats) => sum + stats.bradley_terry_score, 0);
    const normFactor = models.length / totalScore;
    
    models.forEach(model => {
      modelStats[model].bradley_terry_score *= normFactor;
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

      // Update total games
      performances[comparison.model_a].total_games++;
      performances[comparison.model_b].total_games++;
      performances[comparison.model_a].opponents[comparison.model_b].total++;
      performances[comparison.model_b].opponents[comparison.model_a].total++;

      // Update latency metrics
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

    // Calculate Bradley-Terry scores
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

  // Sort models by Bradley-Terry score
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
                  <td className="p-2 border text-right">{stats.bradley_terry_score.toFixed(3)}</td>
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