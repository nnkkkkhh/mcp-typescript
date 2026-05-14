import { BotContext } from "../types/bot-types";

export async function helpHandler(ctx: BotContext) {
    await ctx.reply(
        `Команды:\n` +
        `/start — начать общение\n` +
        `/reset — очистить историю диалога\n` +
        `/help — список команд`
    );
}
