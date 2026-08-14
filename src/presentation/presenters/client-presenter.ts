import { Client } from "@/domain/clients/entities/client";

export class ClientPresenter {
  static toHTTP(client: Client) {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
    };
  }
}