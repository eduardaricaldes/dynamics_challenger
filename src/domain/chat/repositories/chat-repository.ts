import { Conversation } from "@/domain/chat/entities/conversation";
import { Message } from "@/domain/chat/entities/message";

export interface ChatRepository {
  createConversation(
    conversation: Conversation
  ): Promise<Conversation>;

  findConversationById(
    id: string
  ): Promise<Conversation | null>;

  createMessages(
    messages: Message[]
  ): Promise<Message[]>;

  findMessagesByConversationId(
    conversationId: string
  ): Promise<Message[]>;
}