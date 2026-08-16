import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { LLMProvider, LLMHistoryMessage, LLMResponse } from "@/application/chat/gatways/llm-provider";
import { MessageRole } from "@/domain/chat/entities/message";

export class GeminiLlmProvider implements LLMProvider {
  private client: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não foi encontrada nas variáveis de ambiente.");
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Converte o papel (role) do domínio para o papel aceito pela SDK do Gemini ('user' | 'model')
   */
  private mapRoleToGemini(role: MessageRole): "user" | "model" {
    if (role === "assistant" || (role as string) === "model") {
      return "model";
    }
    return "user";
  }

  async generateResponse(params: {
    message: string;
    history: LLMHistoryMessage[];
  }): Promise<LLMResponse> {
    // Configura o modelo exigindo um JSON com a estrutura de LLMResponse
    const model = this.client.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        "Você é um assistente de IA. Analise a intenção da mensagem do usuário e forneça a resposta adequada.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            intent: {
              type: SchemaType.STRING,
              description: "A intenção detectada da mensagem do usuário",
            },
            answer: {
              type: SchemaType.STRING,
              description: "A resposta textual para o usuário",
            },
          },
          required: ["intent", "answer"],
        },
      },
    });

    // Mapeia o histórico para o formato esperado pelo Gemini: [{ role, parts: [{ text }] }]
    const formattedHistory = params.history.map((item) => ({
      role: this.mapRoleToGemini(item.role),
      parts: [{ text: item.content }],
    }));

    // Inicia a sessão de chat com o histórico prévio
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Envia a nova mensagem
    const result = await chat.sendMessage(params.message);
    const rawText = result.response.text();

    // Faz o parse do JSON garantido pelo SchemaType
    const parsedResponse = JSON.parse(rawText) as LLMResponse;

    return {
      intent: parsedResponse.intent,
      answer: parsedResponse.answer,
    };
  }
}