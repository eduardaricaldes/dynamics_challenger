import { MessageIntent,MessageRole} from "@/domain/chat/entities/message";

export interface LLMHistoryMessage {
  role: MessageRole;
  content: string;
}

export interface LLMResponse {
  intent: MessageIntent;
  answer: string;
}

export interface LLMProvider {
  generateResponse(params: {
    message: string;
    history: LLMHistoryMessage[];
  }): Promise<LLMResponse>;
}