// @ts-ignore
import { useMemo } from "react";
//import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import configs from "./configs/config";
import colors from "@/assets/colors";
import { ChartProps } from "@/assets/chartsTypes";

ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const PieChart = ({
  icon = { color: "info", component: "" },
  title = "",
  description = "",
  height = "19.125rem",
  chart,
  bgColor = "info",
}: ChartProps) => {
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
      {useMemo(
        () => (
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
                      mr: 2,
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
              <Pie data={data} options={options} redraw />
            </Box>
          </Box>
        ),
        [chart, height, title, description, icon, bgColor]
      )}
    </Box>
  );
};

export default PieChart;
