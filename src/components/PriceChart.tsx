import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null)[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
};

interface PriceChartProps {
  title: string;
  subtitle: string;
  data: ChartDataType;
  loading: boolean;
}

const PriceChart = ({ title, subtitle, data, loading }: PriceChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#F5BEBE',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `가격: ${context.parsed.y.toLocaleString()}원`;
          },
        },
      },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return value.toLocaleString() + '원';
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="chart-container">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
        <div className="chart-content loading">
          <div className="loading-spinner"></div>
          <p>데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!data || data.labels.length === 0) {
    return (
      <div className="chart-container">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
        <div className="chart-content empty">
          <p>데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h2 className="chart-title">{title}</h2>
      <p className="chart-subtitle">{subtitle}</p>
      <div className="chart-content">
        <div style={{ height: '300px', width: '100%' }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PriceChart; 
