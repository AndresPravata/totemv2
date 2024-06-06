import { useMemo } from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import configs from "./configs/config";

ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

interface IconProps {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  component?: React.ReactNode;
}

interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
}

interface Chart {
  labels: string[];
  datasets: Dataset[];
}

interface PieChartProps {
  icon?: IconProps;
  title?: string;
  description?: string;
  height?: string | number;
  chart: Chart;
}

const PieChart = ({ icon = { color: "info", component: "" }, title = "", description = "", height = "19.125rem", chart }: PieChartProps) => {
  const { data, options } = configs({
    labels: chart.labels || [],
    datasets: chart.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor,
    })),
  });

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
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', borderRadius: 'xl', mr: 2 }}
                  >
                    <Icon fontSize="medium">{icon.component}</Icon>
                  </Box>
                )}
                <Box>
                  {title && <Typography variant="h6">{title}</Typography>}
                  {description && <Typography variant="body2" color="textSecondary">{description}</Typography>}
                </Box>
              </Box>
            ) : null}
            <Box height={height}>
              <Pie data={data} options={options} redraw />
            </Box>
          </Box>
        ),
        [chart, height, title, description, icon]
      )}
    </Box>
  );
};

PieChart.propTypes = {
  icon: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
    ]),
    component: PropTypes.node,
  }),
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
      ]),
    })).isRequired,
  }).isRequired,
};

export default PieChart;
