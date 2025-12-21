import { api } from "./Api";

export const getDashboardSummary = () =>
  api.get("/Statistics/dashboard-summary");
export const getRevenueChart = () => api.get("/Statistics/revenue-chart");
export const getTopProducts = () => api.get("/Statistics/top-products");
