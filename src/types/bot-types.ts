import type { Context, SessionFlavor } from "grammy";

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export interface SessionData {
    messages: Message[];
}

export type BotContext = Context & SessionFlavor<SessionData>;
