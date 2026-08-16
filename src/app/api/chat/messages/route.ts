import { NotFoundError } from "@/application/shared/errors/not-found-error";
import makeSendMessage from "@/main/factories/send-message";
import { ChatPresenter } from "@/presentation/presenters/chat-presenter";

export async function POST(req:Request) {
     try {
      const body =
        await req.json();

      if (
        !body.conversationId ||
        !body.message
      ) {
        return Response.json(
          {
            error:
              "conversationId e message são obrigatórios",
          },
          {
            status: 400,
          }
        );
      }

      const useCase = makeSendMessage();


      const result =
        await useCase.execute({
          conversationId:
            body.conversationId,

          message:
            body.message,
        });

      return Response.json({
        intent: result.intent,
        answer: result.answer,

        messages:
          result.messages.map(
            ChatPresenter
              .messageToHTTP
          ),
      });
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
            "Erro ao enviar mensagem",
        },
        {
          status: 500,
        }
      );
    }
  
}