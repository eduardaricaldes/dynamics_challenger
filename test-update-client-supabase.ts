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

  console.log("ANTES:");
  console.log({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
  });

  client.changeName("Cliente Atualizado");
  client.changeEmail("atualizado@email.com");
  client.changePhone("48911111111");

  const updatedClient = await repository.update(client);

  console.log("\nDEPOIS:");
  console.log({
    id: updatedClient.id,
    name: updatedClient.name,
    email: updatedClient.email,
    phone: updatedClient.phone,
  });
}

main().catch((error) => {
  console.error("Erro:");
  console.error(error);
});