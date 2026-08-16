import { SendMessageUseCase } from "@/application/chat/use-cases/send-message";
import { SupabaseChatRepository } from "@/infrastructure/repositories/supabase-chat-repository";
import { OpenAILLMProvider } from "@/infrastructure/ia/openai-llm-provider";

export default function makeSendMessage(): SendMessageUseCase {
  const chatRepository = new SupabaseChatRepository();
  const llmProvider = new OpenAILLMProvider();
  return new SendMessageUseCase(chatRepository, llmProvider);
}
