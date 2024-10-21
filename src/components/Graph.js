// Graph.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const Graph = ({ moodResponses }) => {
  // Create a data structure for the chart
  const data = {
    labels: ['Mood Rating', 'Primary Stressor'],
    datasets: [
      {
        label: 'Your Mood Today',
        data: [moodResponses.mood || 0, moodResponses.stressor ? 1 : 0],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Graph;
