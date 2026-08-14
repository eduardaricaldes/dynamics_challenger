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
