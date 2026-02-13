import { apiClient } from "./index";
import {
  type DashboardData,
  type DashboardStats,
} from "../types/dashboard";
import { type ApiSuccess } from "../types/common";

export const getDashboard = async (
  limit: number = 5
): Promise<ApiSuccess<DashboardData>> => {
  const response = await apiClient.get<ApiSuccess<DashboardData>>(
    "/admin/dashboard",
    { params: { limit: Math.min(Math.max(1, limit), 20) } }
  );
  return response.data;
};

export const getDashboardStats = async (): Promise<
  ApiSuccess<DashboardStats>
> => {
  const response = await apiClient.get<ApiSuccess<DashboardStats>>(
    "/admin/dashboard/stats"
  );
  return response.data;
};
