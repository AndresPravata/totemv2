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
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
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

const VerticalBarChart: React.FC<BarChartProps> = ({
  icon = { color: "info", component: "" },
  title = "",
  description = "",
  height = "19.125rem",
  chart,
  bgColor = "info",
}) => {
  const { gradients, coloredShadows } = colors;

  const { data, options } = useMemo(
    () =>
      configs({
        labels: chart.labels || [],
        datasets: chart.datasets.map((dataset) => ({
          ...dataset,
          backgroundColor:
            dataset.color == ""
              ? colors.white.main
              : gradients[dataset.color].main,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 6,
        })),
      }),
    [chart]
  );

  return (
    <Box padding="1rem">
      <Box>
        {title || description ? (
          <Box display="flex" alignItems="center" mb={2}>
            {icon.component && (
              <Box
                width="4rem"
                height="4rem"
                bgcolor={icon.color || "dark"}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  borderRadius: "xl",
                  mr: 2,
                }}
              >
                <Icon fontSize="medium">{icon.component}</Icon>
              </Box>
            )}
            <Box>
              {title && <Typography variant="h6">{title}</Typography>}
              {description && (
                <Typography variant="body2" color="textSecondary">
                  {description}
                </Typography>
              )}
            </Box>
          </Box>
        ) : null}
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
      </Box>
    </Box>
  );
};

export default VerticalBarChart;
