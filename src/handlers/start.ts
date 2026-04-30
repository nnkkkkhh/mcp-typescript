import { BotContext } from "../types/bot-types";

export async function startHandler(ctx: BotContext) {
    const name = ctx.from?.first_name ?? "My Lord"
    await ctx.reply(`Hello, ${name}!`);
    await ctx.reply(
        `Привет, ${name}!
    
    Пиши, на телефоне 24/7

    commands:
    /start - начать общение с ботом

    Пока только эта, мб потом еще чего добавлю

    `
    )
}