import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { LLMProvider, LLMHistoryMessage, LLMResponse } from "@/application/chat/gateways/llm-provider";
import { MessageRole } from "@/domain/chat/entities/message";

export class GeminiLlmProvider implements LLMProvider {
  private client: GoogleGenerativeAI;
  private model: string;
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not found in environment variables.");
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  }


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
    const model =
  this.client.getGenerativeModel({
    model: this.model,

    systemInstruction: `
      Você é um assistente de atendimento.

      Classifique a intenção da mensagem em:

      ORDER:
      Assuntos relacionados a pedido, compra,
      entrega, rastreamento ou status de pedido.

      OTHER:
      Qualquer outro assunto.

      O campo intent deve conter exatamente
      "ORDER" ou "OTHER".
    `,

    generationConfig: {
      responseMimeType:
        "application/json",

      responseSchema: {
        type: SchemaType.OBJECT,

        properties: {
          intent: {
            type: SchemaType.STRING,
            format:"enum",
            enum: [
              "ORDER",
              "OTHER",
            ],

            description:
              "Intenção da mensagem",
          },

          answer: {
            type: SchemaType.STRING,

            description:
              "Resposta ao usuário",
          },
        },

        required: [
          "intent",
          "answer",
        ],
      },
    },
  });

    const formattedHistory = params.history.map((item) => ({
      role: this.mapRoleToGemini(item.role),
      parts: [{ text: item.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(params.message);
    const rawText = result.response.text();

    const parsedResponse = JSON.parse(rawText) as LLMResponse;

    return {
      intent: parsedResponse.intent,
      answer: parsedResponse.answer,
    };
  }
}