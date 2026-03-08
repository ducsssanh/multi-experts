"use client";

import { useRef, useEffect } from "react";
import { Message } from "@/lib/types";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 py-1">
      <span className="typing-dot w-1.5 h-1.5 bg-navy-300 rounded-full" />
      <span className="typing-dot w-1.5 h-1.5 bg-navy-300 rounded-full" />
      <span className="typing-dot w-1.5 h-1.5 bg-navy-300 rounded-full" />
    </div>
  );
}

export default function ChatMessages({
  messages,
  isLoading,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[720px] w-full mx-auto px-5 py-4 rounded-xl leading-relaxed text-[0.935rem] animate-fade-in
            ${
              msg.role === "user"
                ? "bg-[#1a2744] border border-navy-600"
                : "bg-transparent"
            }`}
        >
          <div
            className={`text-xs font-bold uppercase tracking-wide mb-1.5
              ${msg.role === "user" ? "text-accent" : "text-emerald-400"}`}
          >
            {msg.role === "user" ? "You" : "Expert"}
          </div>
          <div className="text-navy-50 whitespace-pre-wrap break-words">
            {msg.content}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="max-w-[720px] w-full mx-auto px-5 py-4 rounded-xl animate-fade-in">
          <div className="text-xs font-bold uppercase tracking-wide mb-1.5 text-emerald-400">
            Expert
          </div>
          <TypingIndicator />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
