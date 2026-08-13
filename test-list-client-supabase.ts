import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { SupabaseClientRepository } = await import(
    "./src/infrastructure/repositories/supabase-client-repository"
  );

  const repository = new SupabaseClientRepository();

  const clients = await repository.findAll();

  console.log("Clientes encontrados:");

  console.log(
    clients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
    }))
  );
}

main().catch((error) => {
  console.error("Erro ao listar clientes:");
  console.error(error);
});