import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.QWEN_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

const SYSTEM_PROMPT = `тут промпт`;

export async function askMimi(userMessage: string): Promise<string> {
    const response = await client.chat.completions.create({
        model: "qwen/qwen3.6-plus-preview:free",
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT,
            },
            {
                role: "user",
                content: userMessage,
            },
        ],
    });
    return response.choices[0]?.message?.content ?? "Не удалось получить ответ";
};
