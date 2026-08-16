import { ClientRepository } from "@/domain/clients/repositories/client-repository";
import { ChatRepository } from "@/domain/chat/repositories/chat-repository";
import { NotFoundError } from "@/application/shared/errors/not-found-error";

export class GetChatHistoryUseCase {
  constructor(
    private readonly chatRepository:
      ChatRepository,

    private readonly clientRepository:
      ClientRepository
  ) {}

  async execute(
    conversationId: string
  ) {
    const conversation =
      await this.chatRepository
        .findConversationById(
          conversationId
        );

    if (!conversation) {
      throw new NotFoundError(
        "Conversa não encontrada"
      );
    }

    const client =
      await this.clientRepository
        .findById(
          conversation.clientId
        );

    if (!client) {
      throw new NotFoundError(
        "Cliente não encontrado"
      );
    }

    const messages =
      await this.chatRepository
        .findMessagesByConversationId(
          conversationId
        );

    return {
      client,
      conversation,
      messages,
    };
  }
}