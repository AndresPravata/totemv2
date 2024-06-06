export interface IconProps {
    color?:
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error"
      | "light"
      | "dark";
    component?: React.ReactNode;
  }
  
  export interface BarChartProps {
    icon?: IconProps;
    title?: string;
    description?: string | React.ReactNode;
    height?: string | number;
    chart: Chart;
    bgColor?:
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error"
      | "dark";
  }

  export interface Dataset {
    label: string;
    data: number[];
    color: string;
  }
  
  export interface Chart {
    labels: string[];
    datasets: Dataset[];
  }