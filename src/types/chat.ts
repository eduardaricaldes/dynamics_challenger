export type Intent = "ORDER" | "OTHER";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: Intent | null;
  createdAt: string;
}

export interface StartConversationRequest {
  phone: string;
}

export interface StartConversationResponse {
  client: { id: string; name: string; email: string; phone: string };
  conversation: { id: string; clientId: string; createdAt: string };
}

export interface SendMessageRequest {
  conversationId: string;
  message: string;
}

export interface SendMessageResponse {
  intent: Intent;
  answer: string;
  messages: ChatMessage[];
}
