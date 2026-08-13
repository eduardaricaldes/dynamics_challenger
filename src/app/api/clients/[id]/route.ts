import makeDeleteClient from "@/main/factories/delete-client";
import makeFindByIdClient from "@/main/factories/find-by-id-client";
import makeUpdateClient from "@/main/factories/update-client";

interface ClientParams {
    params: Promise<{
        id: string;
    }>
}

export async function GET(req: Request, { params }: ClientParams) {
    try {
        const { id } = await params;

        const useCase =
            makeFindByIdClient();

        const client =
            await useCase.execute(id);

        if (!client) {
            return Response.json(
                {
                    error: "Cliente não encontrado",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json(client);
    } catch {
        return Response.json(
            {
                error: "Erro ao buscar cliente",
            },
            {
                status: 500,
            }
        );
    }

}

export async function PUT(req: Request, { params }: ClientParams) {
    try {
        const { id } = await params;
        const body = await req.json();

        const useCase = makeUpdateClient();

        const client = await useCase.execute({
            id,
            name: body.name,
            email: body.email,
            phone: body.phone,
        });

        return Response.json(client);
    } catch {
        return Response.json(
            {
                error: "Erro ao atualizar cliente",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(req: Request, { params }: ClientParams) {
    try {
        const { id } = await params;
        const useCase = makeDeleteClient();

        await useCase.execute(id);

        return new Response(null, {
            status: 200,
        });
    } catch {
        return Response.json(
            {
                error: "Erro ao deletar cliente",
            },
            {
                status: 500,
            }
        );
    }
}

