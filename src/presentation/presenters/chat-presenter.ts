import { Conversation } from "@/domain/chat/entities/conversation";
import { Message } from "@/domain/chat/entities/message";
import { Client } from "@/domain/clients/entities/client";

export class ChatPresenter {
  static conversationToHTTP(
    conversation: Conversation
  ) {
    return {
      id: conversation.id,
      clientId: conversation.clientId,
      createdAt:
        conversation.createdAt,
    };
  }

  static messageToHTTP(
    message: Message
  ) {
    return {
      id: message.id,
      conversationId:
        message.conversationId,
      role: message.role,
      content: message.content,
      intent:
        message.intent ?? null,
      createdAt: message.createdAt,
    };
  }

  static clientToHTTP(
    client: Client
  ) {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
    };
  }
}