import { NextResponse } from "next/server";
import makeFindAllClients from "@/main/factories/find-all-clients";
import makeCreateClient from "@/main/factories/create-client";
import { ClientPresenter } from "@/presentation/presenters/client-presenter";

export async function GET() {
    try {
        const findAllUsecase = makeFindAllClients();
        const clients = await findAllUsecase.execute();

        return Response.json(
            clients.map((client) => ClientPresenter.toHTTP(client))
            );
    } catch (error) {
        return Response.json({ error: "error to list clients"},
            {
                status: 500,
            }
        );
    }
}

export async function POST(req: Request){
    try {
    const body = await req.json();

    const useCase = makeCreateClient();

    const client = await useCase.execute({
      name: body.name,
      email: body.email,
      phone: body.phone,
    });
    const response = ClientPresenter.toHTTP(client);

    return Response.json(
      response,
      {
        status: 201,
      }
    );
  } catch {
    return Response.json(
      {
        error: "Erro ao criar cliente",
      },
      {
        status: 500,
      }
    );
  }
}

