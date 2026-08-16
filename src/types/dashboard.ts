export interface DashboardMetrics {
  totalClients: number;
  totalMessages: number;
  orderQuestions: number;
  otherQuestions: number;
}

export interface ChartDataPoint {
  day: string;
  atendimentos: number;
}

export interface DashboardApiResponse {
  totalMessages: number;
  orderMessages: number;
  otherMessages: number;
  chartData: ChartDataPoint[];
}
