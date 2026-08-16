import {
  StartConversationRequest,
  StartConversationResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "@/types/chat";
import { apiFetch } from "./api";

export const chatService = {
  startConversation(
    data: StartConversationRequest
  ): Promise<StartConversationResponse> {
    return apiFetch<StartConversationResponse>("/api/chat/start", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    return apiFetch<SendMessageResponse>("/api/chat/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
