import { Client } from "@/types/client";
import { apiFetch } from "./api";

export const clientsService = {
  list(): Promise<Client[]> {
    return apiFetch<Client[]>("/api/clients");
  },

  getById(id: string): Promise<Client> {
    return apiFetch<Client>(`/api/clients/${id}`);
  },

  create(data: Omit<Client, "id" | "createdAt">): Promise<Client> {
    return apiFetch<Client>("/api/clients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Omit<Client, "id" | "createdAt">): Promise<Client> {
    return apiFetch<Client>(`/api/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/api/clients/${id}`, { method: "DELETE" });
  },
};
