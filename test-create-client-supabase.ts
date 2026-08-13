import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { CreateClientUseCase } = await import(
    "./src/application/clients/use-cases/create-client"
  );

  const { SupabaseClientRepository } = await import(
    "./src/infrastructure/repositories/supabase-client-repository"
  );

  const repository = new SupabaseClientRepository();

  const createClientUseCase =
    new CreateClientUseCase(repository);

  const client = await createClientUseCase.execute({
    name: "Cliente Teste",
    email: "cliente.teste@email.com",
    phone: "48999999999",
  });

  console.log("✅ Cliente criado no Supabase!");

  console.log({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    createdAt: client.createdAt,
  });
}

main().catch((error) => {
  console.error("Erro ao criar cliente:");
  console.error(error);
});