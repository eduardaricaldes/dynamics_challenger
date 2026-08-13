import { CreateClientUseCase } from "@/application/clients/use-cases/create-client"
import { SupabaseClientRepository } from "@/infrastructure/repositories/supabase-client-repository"


export default function makeCreateClient(): CreateClientUseCase {
    const repository = new SupabaseClientRepository();

    return new CreateClientUseCase(repository);
}