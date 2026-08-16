import { NextRequest, NextResponse } from "next/server";
import makeSendMessage from "@/main/factories/send-message";
import { ChatPresenter } from "@/presentation/presenters/chat-presenter";
import { NotFoundError } from "@/application/shared/errors/not-found-error";
//clude que fez esse aqui safado
export async function POST(req: NextRequest) {
  try {
    const { conversationId, message } = await req.json();

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: "conversationId e message são obrigatórios" },
        { status: 400 }
      );
    }

    const sendMessage = makeSendMessage();
    const result = await sendMessage.execute({ conversationId, message });

    return NextResponse.json({
      intent: result.intent,
      answer: result.answer,
      messages: result.messages.map(ChatPresenter.messageToHTTP),
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
