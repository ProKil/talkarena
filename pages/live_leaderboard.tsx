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

interface AggregatedLatencyMetrics {
  avg_first_token: number;
  avg_total_time: number;
  avg_response_length: number;
}

interface AggregatedResult {
  model_a: string;
  model_b: string;
  model_a_wins: number;
  model_b_wins: number;
  ties: number;
  total_comparisons: number;
  model_a_latency: AggregatedLatencyMetrics;
  model_b_latency: AggregatedLatencyMetrics;
}

interface ApiResponse {
  _default: {
    [key: string]: ComparisonData;
  };
}

const ModelComparison: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + 
          encodeURIComponent('https://raw.githubusercontent.com/SALT-NLP/talk-arena/refs/heads/main/live_votes.json');
        
        console.log('Fetching from:', proxyUrl);
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData: ApiResponse = await response.json();
        console.log('Data received:', jsonData);
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        console.error('Fetch error details:', error);
        setError(`${error.message} (${error.name})`);
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const aggregatedResults = useMemo(() => {
    if (!data) return {};
    
    const results: { [key: string]: AggregatedResult } = {};
    
    Object.values(data._default).forEach((comparison: ComparisonData) => {
      const key = `${comparison.model_a} vs ${comparison.model_b}`;
      
      if (!results[key]) {
        results[key] = {
          model_a: comparison.model_a,
          model_b: comparison.model_b,
          model_a_wins: 0,
          model_b_wins: 0,
          ties: 0,
          total_comparisons: 0,
          model_a_latency: {
            avg_first_token: 0,
            avg_total_time: 0,
            avg_response_length: 0,
          },
          model_b_latency: {
            avg_first_token: 0,
            avg_total_time: 0,
            avg_response_length: 0,
          }
        };
      }
      
      // Update win/loss/tie counts
      if (comparison.outcome === 0) results[key].model_a_wins++;
      else if (comparison.outcome === 1) results[key].model_b_wins++;
      else if (comparison.outcome === 0.5) results[key].ties++;
      
      // Update latency metrics
      if (comparison.model_a_latency) {
        results[key].model_a_latency.avg_first_token += comparison.model_a_latency.time_to_first_token;
        results[key].model_a_latency.avg_total_time += comparison.model_a_latency.total_time;
        results[key].model_a_latency.avg_response_length += comparison.model_a_latency.response_length;
      }
      
      if (comparison.model_b_latency) {
        results[key].model_b_latency.avg_first_token += comparison.model_b_latency.time_to_first_token;
        results[key].model_b_latency.avg_total_time += comparison.model_b_latency.total_time;
        results[key].model_b_latency.avg_response_length += comparison.model_b_latency.response_length;
      }
      
      results[key].total_comparisons++;
    });

    // Calculate averages
    Object.values(results).forEach(result => {
      const count = result.total_comparisons;
      
      // Keep the numbers as numbers in the state
      result.model_a_latency.avg_first_token = Number(result.model_a_latency.avg_first_token) / count;
      result.model_a_latency.avg_total_time = Number(result.model_a_latency.avg_total_time) / count;
      result.model_a_latency.avg_response_length = Math.round(Number(result.model_a_latency.avg_response_length) / count);
      
      result.model_b_latency.avg_first_token = Number(result.model_b_latency.avg_first_token) / count;
      result.model_b_latency.avg_total_time = Number(result.model_b_latency.avg_total_time) / count;
      result.model_b_latency.avg_response_length = Math.round(Number(result.model_b_latency.avg_response_length) / count);
    });

    return results;
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4 mx-auto"></div>
          <p>Loading comparison data...</p>
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
          <p className="text-sm mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Model Comparison Results</h2>
        <p className="text-sm text-gray-500">Auto-refreshes every 5 minutes</p>
      </div>
      
      {Object.entries(aggregatedResults).map(([key, result]) => (
        <Card key={key} className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">
              {result.model_a} vs {result.model_b}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Voting Results</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Total Comparisons</p>
                    <p className="font-medium">{result.total_comparisons}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <p className="font-medium">
                      {result.model_a}: {((result.model_a_wins / result.total_comparisons) * 100).toFixed(1)}%
                      <br />
                      {result.model_b}: {((result.model_b_wins / result.total_comparisons) * 100).toFixed(1)}%
                      <br />
                      Ties: {((result.ties / result.total_comparisons) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Average Latency</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">{result.model_a}</p>
                    <p>First token: {result.model_a_latency.avg_first_token.toFixed(2)}s</p>
                    <p>Total time: {result.model_a_latency.avg_total_time.toFixed(2)}s</p>
                    <p>Response length: {result.model_a_latency.avg_response_length}</p>
                  </div>
                  <div>
                    <p className="font-medium">{result.model_b}</p>
                    <p>First token: {result.model_b_latency.avg_first_token.toFixed(2)}s</p>
                    <p>Total time: {result.model_b_latency.avg_total_time.toFixed(2)}s</p>
                    <p>Response length: {result.model_b_latency.avg_response_length}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModelComparison;