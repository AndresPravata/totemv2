import Grid from "@mui/material/Grid";
//import ReportsBarChart from "./ui/BarCharts/ReportsBarChart/ReportsBarChart";
//import HorizontalBarChart from "./ui/BarCharts/HorizontalBarChart/HorizontalBarChart";
import VerticalBarChart from "./ui/BarCharts/VerticalBarChart/VerticalBarChart";
//import PieChart from "./ui/PieChart/PieChart";
import { Box } from "@mui/material";
/*
const reportsBarChartData = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
  };

const verticalBarChartData = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40], backgroundColor: "primary", color: "success" },
    ],
  };
*/
const horizontalBarChartData = {
  labels: ["M", "T", "W", "T", "F", "S", "S"],
  datasets: [
    { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40], color: "" },
    { label: "Buy", data: [50, 20, 10, 22, 50, 10, 40], color: "" }
  ],
};

const Analytics = () => {

  return (
    <div className="flex h-screen">
      <div className="w-[100%] g-gray-800 text-white p-4 overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black text-center">
      <Grid item xs={12} md={6} lg={4}>
            <Box mb={3}>
                <VerticalBarChart
                  chart={horizontalBarChartData}
                />
            </Box>
        </Grid>
      </div>
    </div>
  );
};

export default Analytics;
