import makeDeleteClient from "@/main/factories/delete-client";
import makeFindByIdClient from "@/main/factories/find-by-id-client";
import makeUpdateClient from "@/main/factories/update-client";
import { ClientPresenter } from "@/presentation/presenters/client-presenter";
import { ConflictError } from "@/application/shared/errors/conflict-error";

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
                    error: "Client not found",
                },
                {
                    status: 404,
                }
            );
        }
        const response = ClientPresenter.toHTTP(client);

        return Response.json(response);
    } catch {
        return Response.json(
            {
                error: "Failed to fetch client",
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

        if(client == null){
            return Response.json({
                error:"Failed to update client"
            },{
                status:400
            })
        }
        
        const response = ClientPresenter.toHTTP(client);

        return Response.json(response);
    } catch (error) {
        if (error instanceof ConflictError) {
            return Response.json({ error: error.message }, { status: 409 });
        }
        return Response.json({ error: "Failed to update client" }, { status: 500 });
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
                error: "Failed to delete client",
            },
            {
                status: 500,
            }
        );
    }
}

