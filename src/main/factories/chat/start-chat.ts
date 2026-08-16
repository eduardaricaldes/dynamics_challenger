import { StartChatUseCase } from "@/application/chat/use-cases/start-chat";
import { SupabaseChatRepository } from "@/infrastructure/repositories/supabase-chat-repository";
import { SupabaseClientRepository } from "@/infrastructure/repositories/supabase-client-repository";

export function makeStartChat():StartChatUseCase {
  const clientRepository = new SupabaseClientRepository();
  const chatRepository = new SupabaseChatRepository();

  const useCase =
    new StartChatUseCase(
      clientRepository,
      chatRepository
    );

  return useCase;
}