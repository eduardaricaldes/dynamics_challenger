import { UpdateClientUseCase } from "@/application/clients/use-cases/update-client"
import { SupabaseClientRepository } from "@/infrastructure/repositories/supabase-client-repository"


export default function makeUpdateClient(): UpdateClientUseCase {
    const repository = new SupabaseClientRepository();

    return new UpdateClientUseCase(repository);
}