import { ChatRepository } from "@/domain/chat/repositories/chat-repository";
import { Message } from "@/domain/chat/entities/message";
import { NotFoundError } from "@/application/shared/errors/not-found-error";
import { LLMProvider } from "../gatways/llm-provider";

interface SendMessageRequest {
  conversationId: string;
  message: string;
}

export class SendMessageUseCase {
  constructor( private readonly chatRepository:ChatRepository,
     private readonly llmProvider:LLMProvider
  ) {}

  async execute({conversationId,message,}: SendMessageRequest) {
    const conversation =
      await this.chatRepository.findConversationById(conversationId);

    if (!conversation) {
      throw new NotFoundError(
        "Conversa não encontrada"
      );
    }

    const previousMessages =
      await this.chatRepository
      .findMessagesByConversationId(conversationId);

    const history = previousMessages.map((message) => ({
          role: message.role,
          content: message.content,
        })
      );

    const llmResponse = await this.llmProvider
        .generateResponse({
          message,
          history,
        });

    const userMessage = new Message({
        conversationId,
        role: "user",
        content: message,
        intent: llmResponse.intent,
      });

    const assistantMessage = new Message({
        conversationId,
        role: "assistant",
        content: llmResponse.answer,
      });

    const savedMessages = await this.chatRepository
        .createMessages([
          userMessage,
          assistantMessage,
        ]);

    return {
      intent: llmResponse.intent,
      answer: llmResponse.answer,
      messages: savedMessages,
    };
  }
}