import { bot } from "./bot";

bot.start({ onStart: () => console.log("Bot is up and running!") });