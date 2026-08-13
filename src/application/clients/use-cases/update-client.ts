import { Client } from "@/domain/clients/entities/client";
import { ClientRepository } from "@/domain/clients/repositories/client-repository"

type UpdateClientInput = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
};

export class UpdateClientUseCase {
  constructor(private clientRepository: ClientRepository
  ) { }

  async execute(input: UpdateClientInput): Promise<Client | null> {
    const client = await this.clientRepository.findById(input.id)
    if (!client) {
      return null;
    }

    if (input.name !== undefined) {
      client.changeName(input.name);
    }

    if (input.email !== undefined) {
      client.changeEmail(input.email);
    }

    if (input.phone !== undefined) {
      client.changePhone(input.phone);
    }

    const updatedClient =
      await this.clientRepository.update(client);

    return updatedClient;

  }
}
