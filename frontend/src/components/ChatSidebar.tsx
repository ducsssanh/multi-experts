"use client";

import Link from "next/link";
import { Conversation } from "@/lib/types";

interface ChatSidebarProps {
  expertName: string;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
}

export default function ChatSidebar({
  expertName,
  conversations,
  activeConversationId,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <aside className="w-[260px] bg-navy-800 border-r border-navy-600 flex flex-col shrink-0 max-md:hidden h-full">
      {/* Logo — links home */}
      <div className="p-4 border-b border-navy-600 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-accent hover:text-accent-hover transition-colors no-underline"
          title="Back to home"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-lg font-bold tracking-tight">✦ ExpertChat</span>
        </Link>
      </div>

      {/* Expert name */}
      <div className="px-4 py-3 border-b border-navy-600">
        <span className="text-xs text-navy-300 uppercase tracking-wider font-semibold block mb-1">
          Expert
        </span>
        <span className="text-sm text-navy-50 font-medium">{expertName}</span>
      </div>

      {/* New Chat */}
      <button
        onClick={onNewChat}
        className="mx-3 mt-3 px-4 py-2.5 bg-navy-600 border border-navy-500 rounded-lg
                   text-sm font-medium text-navy-50 flex items-center gap-2
                   hover:bg-navy-500 transition-colors cursor-pointer"
      >
        <span className="text-lg font-light">+</span> New Chat
      </button>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto p-2 mt-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer truncate transition-colors
              ${
                conv.id === activeConversationId
                  ? "bg-navy-600 text-navy-50"
                  : "text-navy-200 hover:bg-navy-700 hover:text-navy-50"
              }`}
          >
            {conv.preview}
          </div>
        ))}
      </div>

      {/* Home link at bottom */}
      <div className="p-3.5 border-t border-navy-600">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-navy-200
                     hover:bg-navy-700 hover:text-navy-50 transition-colors no-underline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Choose another expert
        </Link>
      </div>
    </aside>
  );
}
