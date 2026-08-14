export type Intent = "ORDER_QUESTION" | "OTHER";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: Intent;
  createdAt: string;
}

export interface SendMessageRequest {
  clientId: string;
  message: string;
}

export interface SendMessageResponse {
  message: string;
  intent: Intent;
  response: string;
  createdAt: string;
}
