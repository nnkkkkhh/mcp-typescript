import "dotenv/config"
import { Bot, session } from "grammy";
import { BotContext } from "./types/bot-types";
import { startHandler } from "./handlers/start";
import { askMimi } from "./services/ai";

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    throw new Error("Error");
}

export const bot = new Bot<BotContext>(BOT_TOKEN);

bot.command("start", startHandler);

bot.on("message:text", async (ctx) => {
    const message = ctx.message.text;
    const thinkMessage = await ctx.reply("typing...");
    const response = await askMimi(message);
    await ctx.reply(response);
})
