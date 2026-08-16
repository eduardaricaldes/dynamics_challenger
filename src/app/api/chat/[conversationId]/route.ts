import { GetChatHistoryUseCase } from "@/application/chat/use-cases/get-chat-history";
import { NotFoundError } from "@/application/shared/errors/not-found-error";
import { ChatPresenter } from "@/presentation/presenters/chat-presenter";

export class GetChatHistoryController {
  constructor(
    private readonly useCase:
      GetChatHistoryUseCase
  ) {}

  async handle(
    conversationId: string
  ): Promise<Response> {
    try {
      const result =
        await this.useCase.execute(
          conversationId
        );

      return Response.json({
        client:
          ChatPresenter.clientToHTTP(
            result.client
          ),

        conversation:
          ChatPresenter
            .conversationToHTTP(
              result.conversation
            ),

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
            "Erro ao buscar histórico",
        },
        {
          status: 500,
        }
      );
    }
  }
}