import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const GradioPlotlyChart = ({ api_endpoint }) => {
  const [plotData, setPlotData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const result = await fetch('https://648547ce11878a534b.gradio.live/gradio_api/call/${api_endpoint}', {
	method: 'POST', 
	headers: {'Content-Type': 'application/json'}, 
	body: JSON.stringify({data: []})
	})
	.then(r => r.json())
	.then(j => fetch(`https://648547ce11878a534b.gradio.live/gradio_api/call/${api_endpoint}/${j.event_id}`))
	.then(r => r.body.getReader())
	.then(reader => {
	let result = '';
	return reader.read().then(function process({done, value}) {
	if(done) return result;
	result += new TextDecoder().decode(value);
	return reader.read().then(process);
	});
	})
	.then(text => {
	// Parse the SSE data format
	const sseData = text.split('data: ')[1];
	// Parse the string into a list
	const dataList = JSON.parse(sseData);
	// Parse the first element as JSON
	return JSON.parse(dataList[0]);
	})

	setData(result)
    if (api_endpoint) {
      fetchPlotData();
    } else {
      setError('No API endpoint provided');
      setLoading(false);
    }
  }, [api_endpoint]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-600">Loading plot data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!plotData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-600">No plot data available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-96">
      <Plot
        data={Array.isArray(plotData.data) ? plotData.data : [plotData.data]}
        layout={{
          autosize: true,
          ...plotData.layout
        }}
        config={{
          responsive: true,
          ...plotData.config
        }}
        className="w-full h-full"
        useResizeHandler={true}
      />
    </div>
  );
};

// Optional wrapper component if you need to add more controls or context
const GradioPlotlyContainer = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <GradioPlotlyChart api_endpoint="get_bt_plot" />
      <br/>
      <GradioPlotlyChart api_endpoint="get_wr_plot" />
    </div>
  );
};

export default LeaderboardEmbed;