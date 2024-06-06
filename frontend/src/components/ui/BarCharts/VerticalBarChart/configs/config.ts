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
    scales: {
      y: {
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          color: "#c1c4ce5c",
        },
        ticks: {
          display: true,
          color: "#9ca2b7",
          padding: 10,
          font: {
            size: 11,
            family: "Roboto",
            style: "normal",
            lineHeight: 2,
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawOnChartArea: true,
          drawTicks: true,
          color: "#c1c4ce5c",
        },
        ticks: {
          display: true,
          color: "#9ca2b7",
          padding: 10,
          font: {
            size: 11,
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
