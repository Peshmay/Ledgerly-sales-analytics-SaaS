import { api } from "./axios";

export function createSaleRequest(data: {
  items: { cocktailId: string; quantity: number }[];
}) {
  return api.post("/sales", data);
}
