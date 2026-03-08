"use client";

import { useState, useRef, FormEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-6 pb-6 pt-4 border-t border-navy-600">
      <form onSubmit={handleSubmit}>
        <div
          className="max-w-[720px] mx-auto flex items-end bg-navy-700 border border-navy-600
                      rounded-xl pl-4 pr-1 py-1 transition-colors
                      focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(108,140,255,0.15)]"
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ExpertChat..."
            rows={1}
            className="flex-1 bg-transparent border-none text-navy-50 text-[0.935rem]
                       resize-none outline-none py-2.5 leading-relaxed
                       placeholder:text-navy-300 max-h-[160px] font-[inherit]"
          />
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className="w-9 h-9 rounded-lg border-none flex items-center justify-center
                       shrink-0 transition-all cursor-pointer
                       disabled:bg-navy-500 disabled:text-navy-300 disabled:cursor-not-allowed
                       enabled:bg-accent enabled:text-white enabled:hover:bg-accent-hover"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
