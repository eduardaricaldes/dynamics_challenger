import { DashboardMetrics, ChartDataPoint } from "@/types/dashboard";
import { clientsService } from "./clients.service";

// Chart data is mocked — no /api/dashboard endpoint exists yet.
// When a real endpoint is available, replace getMockChartData() with an API call.
const MOCK_CHART_DATA: ChartDataPoint[] = [
  { day: "Seg", atendimentos: 4 },
  { day: "Ter", atendimentos: 7 },
  { day: "Qua", atendimentos: 5 },
  { day: "Qui", atendimentos: 9 },
  { day: "Sex", atendimentos: 12 },
  { day: "Sáb", atendimentos: 3 },
  { day: "Dom", atendimentos: 2 },
];

export const dashboardService = {
  async getMetrics(sessionMessages: {
    total: number;
    orderQuestions: number;
    otherQuestions: number;
  }): Promise<DashboardMetrics> {
    const clients = await clientsService.list();
    return {
      totalClients: clients.length,
      totalMessages: sessionMessages.total,
      orderQuestions: sessionMessages.orderQuestions,
      otherQuestions: sessionMessages.otherQuestions,
    };
  },

  getChartData(): ChartDataPoint[] {
    return MOCK_CHART_DATA;
  },
};
