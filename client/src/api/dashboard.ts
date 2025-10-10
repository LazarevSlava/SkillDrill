import { api } from "../lib/http";
import type { DashboardSummary } from "../shared/types";

export function fetchDashboardSummary() {
  return api.get<DashboardSummary>("/dashboard/summary");
}
