import { NextResponse } from "next/server";
import makeFindAllClients from "@/main/factories/find-all-clients";
import makeCreateClient from "@/main/factories/create-client";

export async function GET() {
    try {
        const findAllUsecase = makeFindAllClients();
        const clients = await findAllUsecase.execute();

        return NextResponse.json(
            clients.map((client) => ({
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                createdAt: client.createdAt,
            }))
        );
    } catch (error) {
        return NextResponse.json({ error: "error to list clients"},
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

    return Response.json(
      client,
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

