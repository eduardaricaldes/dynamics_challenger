import { Client } from "@/domain/clients/entities/client";
import { ClientRepository } from "@/domain/clients/repositories/client-repository";

type CreateClientDTO = {
    name: string;
    email: string;
    phone: string;
};

export class CreateClientUseCase {
    constructor(private clientRepository: ClientRepository) {
        this.clientRepository = clientRepository;

    }

    async execute(input: CreateClientDTO): Promise<Client> {
        const client = new Client({
            name: input.name,
            email: input.email,
            phone: input.phone,

        });

        const createdClient = await this.clientRepository.create(client);

        return createdClient;
    }
}