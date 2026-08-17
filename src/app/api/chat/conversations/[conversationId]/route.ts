import { NotFoundError } from "@/application/shared/errors/not-found-error";
import { makeGetChatHistory } from "@/main/factories/chat/get-chat-history";
import { ChatPresenter } from "@/presentation/presenters/chat-presenter";

interface ConversationParams {
  params: Promise<{
    conversationId: string;
  }>
}

export async function GET(req: Request,{params}:ConversationParams) {
  try {
    const { conversationId } = await params;
    const useCase = makeGetChatHistory();
    const result =
      await useCase.execute(
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
          "Failed to fetch conversation history",
      },
      {
        status: 500,
      }
    );
  }
}