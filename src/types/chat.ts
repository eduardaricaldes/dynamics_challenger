export type Intent = "ORDER" | "OTHER";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: Intent | null;
  createdAt: string;
}

export interface StartConversationRequest {
  clientId: string;
}

export interface StartConversationResponse {
  id: string;
  clientId: string;
  createdAt: string;
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
