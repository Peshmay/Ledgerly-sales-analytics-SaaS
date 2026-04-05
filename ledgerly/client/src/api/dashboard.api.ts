import { api } from "./axios";

export function getDashboardOverviewRequest() {
  return api.get("/dashboard/overview");
}
