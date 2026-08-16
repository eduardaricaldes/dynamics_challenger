import { SendMessageUseCase } from "@/application/chat/use-cases/send-message";
import { OpenAILLMProvider } from "@/infrastructure/ia/openai-llm-provider";
import { SupabaseChatRepository } from "@/infrastructure/repositories/supabase-chat-repository";
import { SendMessageController } from "@/app/api/chat/messages/router";

export function makeSendMessageController() {
  const chatRepository = new SupabaseChatRepository();

  const llmProvider = new OpenAILLMProvider();

  const useCase = new SendMessageUseCase(
      chatRepository,
      llmProvider
    );

  return new SendMessageController(
    useCase
  );
}