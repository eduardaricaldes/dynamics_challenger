import { FindAllClientUseCase } from "@/application/clients/use-cases/list-clients"
import { SupabaseClientRepository } from "@/infrastructure/repositories/supabase-client-repository"


export default function makeFindAllClients(): FindAllClientUseCase {
    const repository = new SupabaseClientRepository();

    return new FindAllClientUseCase(repository);
}