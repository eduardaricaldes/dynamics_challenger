import { SendMessageUseCase } from "@/application/chat/use-cases/send-message";
import { GeminiLlmProvider } from "@/infrastructure/ia/gemini-llm-provider";
import { SupabaseChatRepository } from "@/infrastructure/repositories/supabase-chat-repository";

export function makeSendMessage():SendMessageUseCase {
  const chatRepository = new SupabaseChatRepository();

  const llmProvider = new GeminiLlmProvider();

  const useCase = new SendMessageUseCase(
      chatRepository,
      llmProvider
    );

  return useCase;
}