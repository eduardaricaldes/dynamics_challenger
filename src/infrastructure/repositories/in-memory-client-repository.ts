import { Client } from "@/domain/clients/entities/client";
import { ClientRepository } from "@/domain/clients/repositories/client-repository";

export class InMemoryClientRepository implements ClientRepository {
  private clients: Client[] = [];

  async create(client: Client): Promise<Client> {
    this.clients.push(client);

    return client;
  }

  async findAll(): Promise<Client[]> {
    return this.clients;
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.clients.find((client) => client.id === id);

    return client ?? null;
  }

  async findByPhone(phone: string): Promise<Client | null> {
    return this.clients.find((client) => client.phone === phone) ?? null;
  }

  async update(client: Client): Promise<Client> {
    return client;
  }

  async delete(id: string): Promise<void> {
    this.clients = this.clients.filter((client) => client.id !== id);
  }
}