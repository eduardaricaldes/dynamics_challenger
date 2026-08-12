import {Client} from "@/domain/clients/entities/client"
import { ClientRepository } from "@/domain/clients/repositories/client-repository"


export class FindByIdClientUseCase{
    constructor(private clientRepository: ClientRepository
    ){}

    async execute(id: string): Promise<Client | null>{
        const client = await this.clientRepository.findById(id)
        return client
    }
}