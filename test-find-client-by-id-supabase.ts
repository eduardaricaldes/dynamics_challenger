import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { SupabaseClientRepository } = await import(
    "./src/infrastructure/repositories/supabase-client-repository"
  );

  const repository = new SupabaseClientRepository();

  const clients = await repository.findAll();

  if (clients.length === 0) {
    console.log("Nenhum cliente encontrado no banco.");
    return;
  }

  const id = clients[0].id;

  console.log("Buscando cliente com ID:");
  console.log(id);

  const client = await repository.findById(id);

  console.log("Cliente encontrado:");

  console.log(client);
}

main().catch((error) => {
  console.error("Erro:");
  console.error(error);
});