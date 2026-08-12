import { CreateClientUseCase } from "./src/application/clients/use-cases/create-client";
import { FindAllClientUseCase } from "./src/application/clients/use-cases/list-clients";
import { DeleteClientUseCase } from "./src/application/clients/use-cases/delete-client";
import { InMemoryClientRepository } from "./src/infrastructure/repositories/in-memory-client-repository";

async function main() {
  const repository = new InMemoryClientRepository();

  const createClientUseCase =
    new CreateClientUseCase(repository);

  const findAllClientsUseCase =
    new FindAllClientUseCase(repository);

  const deleteClientUseCase =
    new DeleteClientUseCase(repository);

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

  console.log("ANTES DO DELETE:");

  let clients = await findAllClientsUseCase.execute();

  console.log(
    clients.map((client) => ({
      id: client.id,
      name: client.name,
    }))
  );

  await deleteClientUseCase.execute(eduarda.id);

  console.log("\nDEPOIS DO DELETE:");

  clients = await findAllClientsUseCase.execute();

  console.log(
    clients.map((client) => ({
      id: client.id,
      name: client.name,
    }))
  );
}

main();