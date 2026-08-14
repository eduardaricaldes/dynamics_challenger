import { randomUUID } from "crypto";

export type MessageRole =
  | "user"
  | "assistant";

export type MessageIntent =
  | "ORDER"
  | "OTHER";

interface MessageDTOProps {
  id?: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  intent?: MessageIntent;
  createdAt?: Date;
}

export class Message {
  private readonly props: {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    intent?: MessageIntent;
    createdAt: Date;
  };

  constructor(props: MessageDTOProps) {
    this.props = {
      id: props.id ?? randomUUID(),
      conversationId: props.conversationId,
      role: props.role,
      content: props.content,
      intent: props.intent,
      createdAt:
        props.createdAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }

  get conversationId() {
    return this.props.conversationId;
  }

  get role() {
    return this.props.role;
  }

  get content() {
    return this.props.content;
  }

  get intent() {
    return this.props.intent;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}