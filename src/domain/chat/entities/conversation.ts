import { randomUUID } from "crypto";

interface ConversationDTOProps {
  id?: string;
  clientId: string;
  createdAt?: Date;
}

export class Conversation {
  private readonly props: {
    id: string;
    clientId: string;
    createdAt: Date;
  };

  constructor(props: ConversationDTOProps) {
    this.props = {
      id: props.id ?? randomUUID(),
      clientId: props.clientId,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }

  get clientId() {
    return this.props.clientId;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}