import { ChartOptions, ChartData } from 'chart.js';
import { Chart } from "@/assets/chartsTypes";

function configs({ labels, datasets }: Chart) {
  const data: ChartData<'bar'> = {
    labels,
    datasets: datasets.map(dataset => ({
        ...dataset,
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 6,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        grid: {
          display: true,
          color: "#c1c4ce5c",
        },
        ticks: {
          padding: 10,
          font: {
            size: 14,
            weight: 300,
            family: "Roboto",
            style: "normal",
            lineHeight: 2,
          },
          color: "#fff",
        },
      },
      x: {
        grid: {
          display: true,
          color: "#c1c4ce5c",
        },
        ticks: {
          display: true,
          color: "#f8f9fa",
          padding: 10,
          font: {
            size: 14,
            weight: 300,
            family: "Roboto",
            style: "normal",
            lineHeight: 2,
          },
        },
      },
    },
  };

  return { data, options };
}

export default configs;
