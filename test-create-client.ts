import { CreateClientUseCase } from "./src/application/clients/use-cases/create-client";
import { UpdateClientUseCase } from "./src/application/clients/use-cases/update-client";
import { InMemoryClientRepository } from "./src/infrastructure/repositories/in-memory-client-repository";

async function main() {
  const repository = new InMemoryClientRepository();

  const createClientUseCase =
    new CreateClientUseCase(repository);

  const updateClientUseCase =
    new UpdateClientUseCase(repository);

  const client = await createClientUseCase.execute({
    name: "Eduarda Silva",
    email: "eduarda@email.com",
    phone: "48999999999",
  });

  console.log("ANTES:");
  console.log("ID:", client.id);
  console.log("Nome:", client.name);
  console.log("Email:", client.email);
  console.log("Telefone:", client.phone);

  const updatedClient = await updateClientUseCase.execute({
    id: client.id,
    name: "Eduarda Caldes",
    phone: "48911111111",
  });

  console.log("\nDEPOIS:");
  console.log("ID:", updatedClient?.id);
  console.log("Nome:", updatedClient?.name);
  console.log("Email:", updatedClient?.email);
  console.log("Telefone:", updatedClient?.phone);
}

main();