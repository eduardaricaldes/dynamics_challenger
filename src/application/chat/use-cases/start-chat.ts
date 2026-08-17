import { ClientRepository } from "@/domain/clients/repositories/client-repository";
import { Conversation } from "@/domain/chat/entities/conversation";
import { ChatRepository } from "@/domain/chat/repositories/chat-repository";
import { NotFoundError } from "@/application/shared/errors/not-found-error";

interface StartChatrequest {
    phone: string
}

export class StartChatUseCase {
    constructor(
        private readonly clientRepository: ClientRepository,

        private readonly chatRepository: ChatRepository

    ) { }

    async execute({ phone }: StartChatrequest) {
        const client = await this.clientRepository.findByPhone(phone);
        if (!client) {
            throw new NotFoundError("Client not found");
        }

        const existing = await this.chatRepository
            .findLatestConversationByClientId(client.id);

        const createdConversation = existing
            ?? await this.chatRepository.createConversation(
                new Conversation({ clientId: client.id })
            );

        return {
            client,
            createdConversation,
        };
    }


}