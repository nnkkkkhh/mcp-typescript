import type { Context, SessionFlavor } from "grammy";

export interface SessionData {
    waitingFor?: boolean
}

export type BotContext = Context & SessionFlavor<SessionData>;  
