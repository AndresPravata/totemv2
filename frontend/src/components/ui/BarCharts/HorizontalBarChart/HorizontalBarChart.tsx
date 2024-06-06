import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import configs from "./configs/config";
import { BarChartProps } from "@/assets/chartsTypes";
import colors from "@/assets/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HorizontalBarChart: React.FC<BarChartProps> = ({
  icon = { color: "info", component: "" },
  title = "",
  description = "",
  height = "19.125rem",
  chart,
  bgColor = "info",
}) => {
  const { gradients, coloredShadows } = colors;

  const chartDatasets = chart.datasets
    ? chart.datasets.map((dataset) => ({
        ...dataset,
        weight: 5,
        borderWidth: 0,
        borderRadius: 4,
        backgroundColor:
          dataset.color == ""
            ? colors.white.main
            : gradients[dataset.color].main,
        fill: false,
        maxBarThickness: 35,
      }))
    : [];

  const { data, options } = configs({
    labels: chart.labels || [],
    datasets: chartDatasets,
  });

  const renderChart = (
    <Box py={2} pr={2} pl={icon.component ? 1 : 2}>
      {title || description ? (
        <Box display="flex" px={description ? 1 : 0} pt={description ? 1 : 0}>
          {icon.component && (
            <Box
              component="div"
              width="4rem"
              height="4rem"
              bgcolor={icon.color || "dark"}
              borderRadius="xl"
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="white"
              mt={-5}
              mr={2}
            >
              <Icon fontSize="medium">{icon.component}</Icon>
            </Box>
          )}
          <Box mt={icon.component ? -2 : 0}>
            {title && <Typography variant="h6">{title}</Typography>}
            <Box mb={2}>
              <Typography component="div" variant="button" color="text">
                {description}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}
      {useMemo(
        () => (
          <Box
            component="div"
            sx={{
              background: `linear-gradient(195deg, ${gradients[bgColor].main}, ${gradients[bgColor].state})`,
              color: colors.dark.main,
              borderRadius: "0.5rem",
              boxShadow: `0rem 0.25rem 1.25rem 0rem ${coloredShadows[bgColor]}`,
              py: 2,
              pr: 0.5,
              mt: -5,
              height: height,
            }}
          >
            <Bar data={data} options={options} redraw />
          </Box>
        ),
        [chart, height, title, description, icon, bgColor]
      )}
    </Box>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

export default HorizontalBarChart;
