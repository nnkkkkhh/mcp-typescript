import "dotenv/config"
import { Bot, session } from "grammy";
import { limit } from "@grammyjs/ratelimiter";
import { FileAdapter } from "@grammyjs/storage-file";
import { BotContext, SessionData } from "./types/bot-types";
import { startHandler } from "./handlers/start";
import { helpHandler } from "./handlers/help";
import { askMimi } from "./services/ai";
import fs from "fs";

const LOG_FILE = "requests.log";

function logRequest(userId: number, username: string | undefined, userMessage: string, response: string) {
    const entry = {
        timestamp: new Date().toISOString(),
        userId,
        username: username ?? "unknown",
        userMessage,
        response,
    };
    console.log(`[${entry.timestamp}] @${entry.username} (${userId}): ${userMessage}`);
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
}

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    throw new Error("Error");
}

export const bot = new Bot<BotContext>(BOT_TOKEN);

bot.use(limit({
    timeFrame: 10000,
    limit: 3,
    onLimitExceeded: async (ctx) => {
        await ctx.reply("Слишком много сообщений. Подожди немного.");
    },
}));

bot.use(session({
    initial: (): SessionData => ({ messages: [] }),
    storage: new FileAdapter({ dirName: "sessions" }),
}));

bot.api.setMyCommands([
    { command: "start", description: "Начать общение" },
    { command: "help", description: "Список команд" },
    { command: "reset", description: "Очистить историю диалога" },
]);

bot.command("start", startHandler);
bot.command("help", helpHandler);

bot.command("reset", async (ctx) => {
    ctx.session.messages = [];
    await ctx.reply("История очищена.");
});

bot.on("message:text", async (ctx) => {
    const userMessage = ctx.message.text;
    const thinkMessage = await ctx.reply("typing...");

    ctx.session.messages.push({ role: "user", content: userMessage });

    try {
        const response = await askMimi(ctx.session.messages);
        ctx.session.messages.push({ role: "assistant", content: response });
        logRequest(ctx.from.id, ctx.from.username, userMessage, response);
        await ctx.api.deleteMessage(ctx.chat.id, thinkMessage.message_id);
        await ctx.reply(response);
    } catch (err) {
        ctx.session.messages.pop(); // откатываем незавершённое сообщение
        console.error(`[ERROR] userId=${ctx.from.id}:`, err);
        await ctx.api.deleteMessage(ctx.chat.id, thinkMessage.message_id);
        await ctx.reply("Произошла ошибка, попробуй ещё раз.");
    }
});
