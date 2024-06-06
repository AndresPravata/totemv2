import { ChartOptions, ChartData } from 'chart.js';
import colors from '@/assets/colors';

const { dark } = colors;

//type GradientKeys = keyof typeof gradients;

interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
}

interface ConfigsParams {
  labels: string[];
  datasets: Dataset[];
}

function configs({ labels, datasets }: ConfigsParams) {
  const processedDatasets = datasets.map(dataset => {
    let backgroundColors: string[] = [];

    if (dataset.backgroundColor) {
      if (Array.isArray(dataset.backgroundColor)) {
        dataset.backgroundColor.forEach(() =>
          backgroundColors.push(dark.main)
        );
      } else {
        backgroundColors.push(dark.main);
      }
    } else {
      backgroundColors.push(dark.main);
    }

    return {
      ...dataset,
      backgroundColor: backgroundColors,
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
      maxBarThickness: 6,
    };
  });

  const data: ChartData<'pie'> = {
    labels,
    datasets: processedDatasets,
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
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
