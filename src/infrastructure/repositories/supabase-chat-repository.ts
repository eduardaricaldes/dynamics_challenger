import { Conversation } from "@/domain/chat/entities/conversation";
import { Message } from "@/domain/chat/entities/message";
import { ChatRepository } from "@/domain/chat/repositories/chat-repository";
import { supabase } from "../database/supabase";

export class SupabaseChatRepository
  implements ChatRepository
{
  async createConversation( conversation: Conversation ): Promise<Conversation> {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        id: conversation.id,
        client_id: conversation.clientId,
        created_at:
          conversation.createdAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to create conversation:${error.message}`
      );
    }

    return new Conversation({
      id: data.id,
      clientId: data.client_id,
      createdAt:
        new Date(data.created_at),
    });
  }

  async findLatestConversationByClientId(
    clientId: string
  ): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to find conversation by client: ${error.message}`
      );
    }

    if (!data) return null;

    return new Conversation({
      id: data.id,
      clientId: data.client_id,
      createdAt: new Date(data.created_at),
    });
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to find conversation: ${error.message}`
      );
    }

    if (!data) {
      return null;
    }

    return new Conversation({
      id: data.id,
      clientId: data.client_id,
      createdAt:
        new Date(data.created_at),
    });
  }

  async createMessages(
    messages: Message[]
  ): Promise<Message[]> {
    const payload = messages.map(
      (message) => ({
        id: message.id,
        conversation_id:
          message.conversationId,
        role: message.role,
        content: message.content,
        intent: message.intent ?? null,
        created_at:
          message.createdAt.toISOString(),
      })
    );

    const { data, error } = await supabase
      .from("messages")
      .insert(payload)
      .select();

    if (error) {
      throw new Error(
        `Failed to save messages: ${error.message}`
      );
    }

    return data.map(
      (message) =>
        new Message({
          id: message.id,
          conversationId:
            message.conversation_id,
          role: message.role,
          content: message.content,
          intent:
            message.intent ?? undefined,
          createdAt:
            new Date(message.created_at),
        })
    );
  }

  async findMessagesByConversationId(
    conversationId: string
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq(
        "conversation_id",
        conversationId
      )
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      throw new Error(
        `Failed to fetch messages: ${error.message}`
      );
    }

    return data.map(
      (message) =>
        new Message({
          id: message.id,
          conversationId:
            message.conversation_id,
          role: message.role,
          content: message.content,
          intent:
            message.intent ?? undefined,
          createdAt:
            new Date(message.created_at),
        })
    );
  }
}