import { Telegraf } from 'telegraf';
import {
  getTotalGames,
  getTotalSortedByConsole,
  getTotalSortedByGenre,
  getTotalSortedGames,
  sortThreeGames,
} from './functions';
import IgdbService from './services/igdb.service';

const bot = new Telegraf(process.env.BOT_TOKEN || '');
const start = async () => {
  await bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/${process.env.BOT_TOKEN}`);
  console.log(`Webhook set to ${process.env.WEBHOOK_URL}`);

  await bot.telegram.setWebhook(`/${process.env.BOT_TOKEN}`);
  console.log(`Webhook listening on ${process.env.WEBHOOK_URL}:${process.env.PORT}`);
};

start();

bot.command('count', async (ctx) => ctx.reply(await getTotalGames(ctx)));
bot.command('consoles', async (ctx) => ctx.reply(await getTotalSortedByConsole(ctx)));
bot.command('genres', async (ctx) => ctx.reply(await getTotalSortedByGenre(ctx)));
bot.command('games', async (ctx) => ctx.replyWithMarkdown(await getTotalSortedGames(ctx), { disable_web_page_preview: true }));
bot.command('sort', async (ctx) => sortThreeGames(ctx));
bot.on('inline_query', async (ctx) => new IgdbService(ctx).run(ctx.inlineQuery));

export default bot;