export interface Expert {
  id: string;
  name: string;
  description: string;
}

export interface ChatRequest {
  message: string;
  expert_id?: string | null;
  conversation_id?: string | null;
}

export interface ChatResponse {
  reply: string;
  expert_id: string;
  conversation_id: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Conversation {
  id: string;
  preview: string;
}
