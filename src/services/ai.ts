import { OpenAI } from "openai";
import type { Message } from "../types/bot-types";

const client = new OpenAI({
    apiKey: process.env.QWEN_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

const SYSTEM_PROMPT = `тут промпт`;

const MAX_HISTORY = 20;

export async function askMimi(history: Message[]): Promise<string> {
    const trimmed = history.slice(-MAX_HISTORY);
    const response = await client.chat.completions.create({
        model: "qwen/qwen3.6-plus-preview:free",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...trimmed,
        ],
    });
    return response.choices[0]?.message?.content ?? "Не удалось получить ответ";
};
