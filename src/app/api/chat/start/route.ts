import { NotFoundError } from "@/application/shared/errors/not-found-error";
import { makeStartChat } from "@/main/factories/chat/start-chat";
import { ChatPresenter } from "@/presentation/presenters/chat-presenter";

export async function POST(req:Request) {

   try {
      const body =
        await req.json();

      if (!body.phone) {
        return Response.json(
          {
            error:
              "Telefone é obrigatório",
          },
          {
            status: 400,
          }
        );
      }

      const useCase = makeStartChat();

      const result =
        await useCase.execute({
          phone: body.phone,
        });

      return Response.json(
        {
          client:
            ChatPresenter.clientToHTTP(
              result.client
            ),

          conversation:
            ChatPresenter
              .conversationToHTTP(
                result.createdConversation
              ),
        },
        {
          status: 201,
        }
      );
    } catch (error) {
      if (
        error instanceof NotFoundError
      ) {
        return Response.json(
          {
            error: error.message,
          },
          {
            status: 404,
          }
        );
      }

      console.error(error);

      return Response.json(
        {
          error:
            "Erro ao iniciar conversa",
        },
        {
          status: 500,
        }
      );
    }
  
}