import { NextRequest, NextResponse } from "next/server";
import { SupabaseClientRepository } from "@/infrastructure/repositories/supabase-client-repository";
import { SupabaseChatRepository } from "@/infrastructure/repositories/supabase-chat-repository";
import { Conversation } from "@/domain/chat/entities/conversation";
import { NotFoundError } from "@/application/shared/errors/not-found-error";

export async function POST(req: NextRequest) {
  try {
    const { clientId } = await req.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "clientId obrigatório" },
        { status: 400 }
      );
    }

    const clientRepo = new SupabaseClientRepository();
    const client = await clientRepo.findById(clientId);

    if (!client) {
      throw new NotFoundError("Cliente não encontrado");
    }

    const chatRepo = new SupabaseChatRepository();
    const created = await chatRepo.createConversation(
      new Conversation({ clientId: client.id })
    );

    return NextResponse.json({
      id: created.id,
      clientId: created.clientId,
      createdAt: created.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
