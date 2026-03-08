import { Expert, ChatRequest, ChatResponse } from "./types";

const BASE = "/api";

export async function fetchExperts(): Promise<Expert[]> {
  const res = await fetch(`${BASE}/experts/`);
  if (!res.ok) throw new Error("Failed to fetch experts");
  return res.json();
}

export async function sendMessage(payload: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${BASE}/chat/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
