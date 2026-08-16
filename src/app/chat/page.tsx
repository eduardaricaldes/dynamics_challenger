"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, MessageSquare, Search } from "lucide-react";
import { Client } from "@/types/client";
import { Intent } from "@/types/chat";
import { clientsService } from "@/services/clients.service";
import { chatService } from "@/services/chat.service";

interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: Intent | null;
  pending?: boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-cyan-500",
];

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function IntentBadge({ intent }: { intent: Intent | null | undefined }) {
  if (!intent) return null;
  if (intent === "ORDER") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
        Pedido
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
      Outro
    </span>
  );
}

export default function ChatPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    clientsService
      .list()
      .then(setClients)
      .finally(() => setClientsLoading(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.phone.includes(clientSearch)
  );

  async function handleSelectClient(client: Client) {
    if (selectedClient?.id === client.id) {
      setMobileView("chat");
      return;
    }
    setSelectedClient(client);
    setMessages([]);
    setConversationId(null);
    setMobileView("chat");
    setStarting(true);
    try {
      const conv = await chatService.startConversation({ phone: client.phone });
      setConversationId(conv.conversation.id);
    } finally {
      setStarting(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || !conversationId || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "user", content: text },
      { id: "thinking", role: "assistant", content: "", pending: true },
    ]);

    try {
      const result = await chatService.sendMessage({
        conversationId,
        message: text,
      });
      setMessages((prev) => {
        const base = prev.filter(
          (m) => m.id !== "thinking" && m.id !== tempId
        );
        const userMsg = result.messages.find((m) => m.role === "user");
        const assistantMsg = result.messages.find(
          (m) => m.role === "assistant"
        );
        return [
          ...base,
          userMsg
            ? { id: userMsg.id, role: "user" as const, content: userMsg.content }
            : { id: tempId, role: "user" as const, content: text },
          ...(assistantMsg
            ? [
                {
                  id: assistantMsg.id,
                  role: "assistant" as const,
                  content: assistantMsg.content,
                  intent: assistantMsg.intent,
                },
              ]
            : []),
        ];
      });
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== "thinking"));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Client list */}
      <div
        className={`${
          mobileView === "chat" ? "hidden lg:flex" : "flex"
        } w-full lg:w-80 flex-shrink-0 border-r border-gray-200 bg-white flex-col`}
      >
        <div className="px-4 pt-14 pb-3 lg:pt-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">Clientes</h2>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {clientsLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}

          {!clientsLoading &&
            filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => handleSelectClient(client)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 text-left transition-colors ${
                  selectedClient?.id === client.id
                    ? "bg-indigo-50 border-l-2 border-l-indigo-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${avatarColor(client.name)}`}
                >
                  {getInitials(client.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {client.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {client.phone}
                  </p>
                </div>
              </button>
            ))}

          {!clientsLoading && filteredClients.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              Nenhum cliente encontrado.
            </p>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div
        className={`${
          mobileView === "list" ? "hidden lg:flex" : "flex"
        } flex-1 flex-col bg-gray-50 min-w-0`}
      >
        {selectedClient ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 pt-14 pb-3 lg:pt-3 flex items-center gap-3">
              <button
                onClick={() => setMobileView("list")}
                className="lg:hidden p-1 -ml-1 mr-1 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={20} />
              </button>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${avatarColor(selectedClient.name)}`}
              >
                {getInitials(selectedClient.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedClient.name}
                </p>
                <p className="text-xs text-gray-400">{selectedClient.phone}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {starting && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Iniciando conversa...
                </p>
              )}
              {!starting && messages.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  Envie uma mensagem para começar.
                </p>
              )}
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[72%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      {msg.pending ? (
                        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      ) : (
                        <>
                          <div
                            className={`px-4 py-2.5 text-sm leading-relaxed ${
                              msg.role === "user"
                                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
                                : "bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100"
                            }`}
                          >
                            {msg.content}
                          </div>
                          {msg.role === "assistant" && (
                            <IntentBadge intent={msg.intent} />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-3 flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending || starting || !conversationId}
                placeholder="Digite uma mensagem... (Enter para enviar)"
                rows={1}
                className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 max-h-32"
              />
              <button
                onClick={handleSend}
                disabled={
                  !input.trim() || sending || starting || !conversationId
                }
                className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <MessageSquare size={28} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-gray-700 font-medium">Selecione um cliente</p>
              <p className="text-sm text-gray-400 mt-1">
                Escolha um cliente na lista para iniciar um atendimento
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
