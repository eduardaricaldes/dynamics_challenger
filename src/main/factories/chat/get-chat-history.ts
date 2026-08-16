import { GetChatHistoryUseCase } from "@/application/chat/use-cases/get-chat-history";
import { SupabaseChatRepository } from "@/infrastructure/repositories/supabase-chat-repository";
import { SupabaseClientRepository } from "@/infrastructure/repositories/supabase-client-repository";

export function makeGetChatHistory():GetChatHistoryUseCase {
  const chatRepository =
    new SupabaseChatRepository();

  const clientRepository =
    new SupabaseClientRepository();

  const useCase =
    new GetChatHistoryUseCase(
      chatRepository,
      clientRepository
    );

    return useCase;
}