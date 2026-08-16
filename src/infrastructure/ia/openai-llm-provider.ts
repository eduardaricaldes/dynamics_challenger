import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

import {
  LLMProvider,
  LLMHistoryMessage,
  LLMResponse,
} from "@/application/chat/gateways/llm-provider";

import { MessageRole } from "@/domain/chat/entities/message";

const responseSchema = z.object({
  intent: z.enum([
    "ORDER",
    "OTHER",
  ]),

  answer: z.string(),
});

export class OpenAILLMProvider
  implements LLMProvider
{
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor() {
    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY não configurada"
      );
    }

    this.openai = new OpenAI({
      apiKey,
    });

    this.model =
      process.env.OPENAI_MODEL ||
      "gpt-5.6";
  }

  private mapRoleToOpenAI(
    role: MessageRole
  ): "user" | "assistant" {
    if (
      role === "assistant" ||
      (role as string) === "model"
    ) {
      return "assistant";
    }

    return "user";
  }

  async generateResponse({
    message,
    history,
  }: {
    message: string;
    history: LLMHistoryMessage[];
  }): Promise<LLMResponse> {
    const formattedHistory =
      history.map((item) => ({
        role:
          this.mapRoleToOpenAI(
            item.role
          ),

        content: item.content,
      }));

    const response =
      await this.openai.responses.parse({
        model: this.model,

        instructions: `
          Você é um atendente virtual
          da Dynamics Labs.

          Sua tarefa possui duas
          responsabilidades:

          1. Classificar a intenção
          da mensagem.

          2. Responder ao cliente.

          As únicas intenções
          permitidas são:

          ORDER:
          Use quando a mensagem estiver
          relacionada a pedido, entrega,
          rastreamento, prazo, status
          ou número de pedido.

          OTHER:
          Use para qualquer outro
          assunto.

          Esta é uma aplicação
          de demonstração.

          Você NÃO possui acesso
          ao sistema real de pedidos.

          Nunca invente status
          de pedidos.

          Responda de maneira curta,
          educada e objetiva.
        `,

        input: [
          ...formattedHistory,

          {
            role: "user",
            content: message,
          },
        ],

        text: {
          format: zodTextFormat(
            responseSchema,
            "chat_response"
          ),
        },
      });

    const parsedResponse =
      response.output_parsed;

    if (!parsedResponse) {
      throw new Error(
        "LLM não retornou uma resposta válida"
      );
    }

    return {
      intent: parsedResponse.intent,
      answer: parsedResponse.answer,
    };
  }
}