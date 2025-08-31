export interface ChartData {
  code: string[];
  series: any;
  categories: string[];
}

export interface AllData {
  total: number;
  pie: ChartData;
  bar: ChartData;
  column: ChartData;
  histogram: ChartData;
}

export interface ResponseData {
  meta: {
    status: number;
    message: string;
    code: number;
  };
  data: {
    all: AllData;
    [key: string]: any;
  };
}

export interface SentimentData {
  channel: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}
