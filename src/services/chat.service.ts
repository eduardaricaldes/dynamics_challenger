import { SendMessageRequest, SendMessageResponse } from "@/types/chat";
import { apiFetch } from "./api";

export const chatService = {
  sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    return apiFetch<SendMessageResponse>("/api/chat/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
