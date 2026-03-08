"use client";

import { useState, useCallback, use } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import { sendMessage } from "@/lib/api";
import { Message, Conversation } from "@/lib/types";

const EXPERT_NAMES: Record<string, string> = {
  general: "General Assistant",
  code: "Code Expert",
  math: "Math Expert",
};

export default function ChatPage({
  params,
}: {
  params: Promise<{ expertId: string }>;
}) {
  const { expertId } = use(params);
  const expertName = EXPERT_NAMES[expertId] ?? expertId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const data = await sendMessage({
          message: text,
          expert_id: expertId,
          conversation_id: conversationId,
        });

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setConversationId(data.conversation_id);

        setConversations((prev) => {
          if (prev.some((c) => c.id === data.conversation_id)) return prev;
          const preview = text.length > 30 ? text.slice(0, 30) + "…" : text;
          return [{ id: data.conversation_id, preview }, ...prev];
        });
      } catch {
        const errorMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong. Is the backend running?",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [expertId, conversationId]
  );

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="flex h-dvh w-full">
      <ChatSidebar
        expertName={expertName}
        conversations={conversations}
        activeConversationId={conversationId}
        onNewChat={handleNewChat}
      />

      <main className="flex flex-1 flex-col min-w-0 h-full">
        {/* Header */}
        <div className="shrink-0 px-6 py-3.5 border-b border-navy-600 flex items-center">
          <span className="bg-accent-glow text-accent px-3 py-1 rounded-full text-xs font-semibold border border-accent/20">
            {expertName}
          </span>
        </div>

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl text-accent mb-3">✦</div>
              <h2 className="text-xl font-semibold text-navy-50">
                Chat with {expertName}
              </h2>
              <p className="text-navy-300 text-sm mt-1">
                Send a message to get started.
              </p>
            </div>
          </div>
        ) : (
          <ChatMessages messages={messages} isLoading={isLoading} />
        )}

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </main>
    </div>
  );
}
