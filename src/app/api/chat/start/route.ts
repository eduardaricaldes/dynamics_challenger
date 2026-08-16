import { StartChatUseCase } from "@/application/chat/use-cases/start-chat";
import { NotFoundError } from "@/application/shared/errors/not-found-error";
import { ChatPresenter } from "@/presentation/presenters/chat-presenter";

export class StartChatController {
  constructor(
    private readonly useCase:
      StartChatUseCase
  ) {}

  async handle(
    request: Request
  ): Promise<Response> {
    try {
      const body =
        await request.json();

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

      const result =
        await this.useCase.execute({
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
}