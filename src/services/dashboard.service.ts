import { DashboardApiResponse } from "@/types/dashboard";
import { apiFetch } from "./api";

export const dashboardService = {
  getStats(): Promise<DashboardApiResponse> {
    return apiFetch<DashboardApiResponse>("/api/dashboard");
  },
};
