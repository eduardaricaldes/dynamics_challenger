import { ClientRepository } from "@/domain/clients/repositories/client-repository";

export class DeleteClientUseCase {
  constructor(
    private clientRepository: ClientRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }
}