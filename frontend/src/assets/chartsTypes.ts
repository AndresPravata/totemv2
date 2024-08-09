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
  
  export interface ChartProps {
    icon?: IconProps;
    title?: string;
    description?: string | React.ReactNode;
    height?: string | number;
    chart: Chart;
    boxBgColor?:
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error"
      | "dark"
      | "light";
    bgColor?:
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error"
      | "dark"
      | "light";
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