import { Client } from "@/domain/clients/entities/client";
import { ClientRepository } from "@/domain/clients/repositories/client-repository";

export class FindAllClientUseCase{
    constructor(private clientRepository:ClientRepository
    ){}

    async execute(): Promise<Client[]>{
        const client = await this.clientRepository.findAll();
        return client;
    }
}