import { Client } from "../entities/client";

export interface ClientRepository {
  create(client: Client): Promise<Client>;
  findAll(): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  findByPhone(phone: string): Promise<Client | null>;
  update(client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
}