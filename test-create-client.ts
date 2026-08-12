import { CreateClientUseCase } from "./src/application/clients/use-cases/create-client";
import { InMemoryClientRepository } from "./src/infrastructure/repositories/in-memory-client-repository";

async function main() {
  const repository = new InMemoryClientRepository();

  const createClientUseCase = new CreateClientUseCase(repository);

  const client = await createClientUseCase.execute({
    name: "Eduarda Silva",
    email: "eduarda@email.com",
    phone: "48999999999",
  });

  console.log("Cliente criado:");
  console.log(client);

  console.log("\nClientes armazenados:");

  const clients = await repository.findAll();

  console.log(clients);
}

main();