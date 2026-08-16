import { SendMessageUseCase } from "@/application/chat/use-cases/send-message";
import { NotFoundError } from "@/application/shared/errors/not-found-error";
import { ChatPresenter } from "@/presentation/presenters/chat-presenter";

export class SendMessageController {
  constructor(
    private readonly useCase:
      SendMessageUseCase
  ) {}

  async handle(
    request: Request
  ): Promise<Response> {
    try {
      const body =
        await request.json();

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

      const result =
        await this.useCase.execute({
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
}