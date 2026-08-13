import { FindByIdClientUseCase } from "@/application/clients/use-cases/find-client-by-id"
import { SupabaseClientRepository } from "@/infrastructure/repositories/supabase-client-repository"


export default function makeFindByIdClient(): FindByIdClientUseCase {
    const repository = new SupabaseClientRepository();

    return new FindByIdClientUseCase(repository);
}