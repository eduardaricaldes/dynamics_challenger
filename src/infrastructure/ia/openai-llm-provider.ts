import OpenAI from "openai";
import { z } from "zod";

import {LLMProvider,LLMResponse,} from "@/application/chat/gatways/llm-provider";

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

    const model =
      process.env.OPENAI_MODEL;

    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY não configurada"
      );
    }

    if (!model) {
      throw new Error(
        "OPENAI_MODEL não configurado"
      );
    }

    this.openai = new OpenAI({
      apiKey,
    });

    this.model = model;
  }

  async generateResponse({
    message,
    history,
  }: {
    message: string;
    history: {
      role: "user" | "assistant";
      content: string;
    }[];
  }): Promise<LLMResponse> {
    const response =
      await this.openai.responses.create({
        model: this.model,

        instructions: `
Você é um atendente virtual da Dynamics Labs.

Sua tarefa possui duas responsabilidades:

1. Classificar a intenção da mensagem.
2. Responder ao cliente.

As únicas intenções permitidas são:

ORDER:
Use quando a mensagem estiver relacionada
a pedido, entrega, rastreamento, prazo,
status ou número de pedido.

OTHER:
Use para qualquer outro assunto.

Esta é uma aplicação de demonstração.
Você NÃO possui acesso ao sistema real
de pedidos.

Nunca invente status de pedidos.

Responda de maneira curta, educada
e objetiva.

Sua resposta deve conter SOMENTE JSON
válido neste formato:

{
  "intent": "ORDER",
  "answer": "texto da resposta"
}
        `,

        input: [
          ...history.map((item) => ({
            role: item.role,
            content: item.content,
          })),

          {
            role: "user",
            content: message,
          },
        ],
      });

    let parsed: unknown;

    try {
      parsed = JSON.parse(
        response.output_text
      );
    } catch {
      throw new Error(
        "LLM retornou JSON inválido"
      );
    }

    return responseSchema.parse(parsed);
  }
}