import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { SupabaseClientRepository } = await import(
    "./src/infrastructure/repositories/supabase-client-repository"
  );

  const repository = new SupabaseClientRepository();

  const clients = await repository.findAll();

  if (clients.length === 0) {
    console.log("Nenhum cliente encontrado.");
    return;
  }

  const client = clients[0];

  console.log("Cliente que será deletado:");
  console.log({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
  });

  await repository.delete(client.id);

  console.log("\nCliente deletado com sucesso.");

  const clientAfterDelete = await repository.findById(client.id);

  console.log("\nBusca depois do delete:");
  console.log(clientAfterDelete);
}

main().catch((error) => {
  console.error("Erro:");
  console.error(error);
});