"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchExperts } from "@/lib/api";
import { Expert } from "@/lib/types";

const EXPERT_ICONS: Record<string, string> = {
  general: "💬",
  code: "💻",
  math: "📐",
};

const FALLBACK_EXPERTS: Expert[] = [
  { id: "general", name: "General Assistant", description: "A general-purpose assistant for everyday questions." },
  { id: "code", name: "Code Expert", description: "Specializes in programming and software engineering." },
  { id: "math", name: "Math Expert", description: "Specializes in mathematics and quantitative reasoning." },
];

export default function Home() {
  const [experts, setExperts] = useState<Expert[]>(FALLBACK_EXPERTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperts()
      .then(setExperts)
      .catch(() => setExperts(FALLBACK_EXPERTS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="text-center">
          <div className="text-5xl text-accent mb-4">✦</div>
          <h1 className="text-3xl font-bold text-navy-50 tracking-tight">
            ExpertChat
          </h1>
          <p className="text-navy-200 mt-2 text-base">
            Choose an expert to start a conversation.
          </p>
        </div>

        {/* Expert cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {experts.map((expert) => (
            <Link
              key={expert.id}
              href={`/chat/${expert.id}`}
              className="group flex flex-col gap-3 p-5 bg-navy-800 border border-navy-600
                         rounded-2xl hover:bg-navy-700 hover:border-navy-500
                         transition-all duration-200 no-underline"
            >
              <span className="text-3xl">
                {EXPERT_ICONS[expert.id] ?? "🤖"}
              </span>
              <div>
                <h2 className="text-base font-semibold text-navy-50 group-hover:text-accent transition-colors">
                  {expert.name}
                </h2>
                <p className="text-sm text-navy-300 mt-1 leading-relaxed">
                  {expert.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {!loading && (
          <p className="text-navy-400 text-xs">
            Click a card to start chatting
          </p>
        )}
      </div>
    </div>
  );
}
