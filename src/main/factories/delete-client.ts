import { DeleteClientUseCase } from "@/application/clients/use-cases/delete-client"
import { SupabaseClientRepository } from "@/infrastructure/repositories/supabase-client-repository"


export default function makeDeleteClient(): DeleteClientUseCase {
    const repository = new SupabaseClientRepository();

    return new DeleteClientUseCase(repository);
}