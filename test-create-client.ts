import { CreateClientUseCase } from "./src/application/clients/use-cases/create-client";
import { FindAllClientUseCase } from "./src/application/clients/use-cases/list-clients";
import { FindByIdClientUseCase } from "./src/application/clients/use-cases/find-client-by-id"
import { InMemoryClientRepository } from "./src/infrastructure/repositories/in-memory-client-repository";


async function main() {
  const repository = new InMemoryClientRepository();

  const createClientUseCase =
    new CreateClientUseCase(repository);

  const listClientsUseCase =
    new FindAllClientUseCase(repository);

  const findClientByIdUseCase =
    new FindByIdClientUseCase(repository);

  const eduarda = await createClientUseCase.execute({
    name: "Eduarda Silva",
    email: "eduarda@email.com",
    phone: "48999999999",
  });

  await createClientUseCase.execute({
    name: "João Souza",
    email: "joao@email.com",
    phone: "48988888888",
  });

  console.log("ID da Eduarda:");
  console.log(eduarda.id);

  if (!eduarda.id) {
    throw new Error("Cliente sem ID");
  }

  const clientFound = await findClientByIdUseCase.execute(
    eduarda.id
  );

  console.log("\nCliente encontrado:");
  console.log(clientFound);

  const clients = await listClientsUseCase.execute();

  console.log("\nTodos os clientes:");
  console.log(clients);
}

main();