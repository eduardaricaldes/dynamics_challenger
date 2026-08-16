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

        const client = await this.clientRepository.findByPhone(phone)
        if (!client) {
            throw new NotFoundError("client not found")
        }
        const conversation = new Conversation({
            clientId: client.id,
        });

        const createdConversation = await this
        .chatRepository
        .createConversation(conversation);

        return {
            client,
            createdConversation,
        };
    }


}