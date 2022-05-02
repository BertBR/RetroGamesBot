import { Telegraf } from 'telegraf';
import {
  getTotalGames,
  getTotalSortedByConsole,
  getTotalSortedByGenre,
  getTotalSortedGames,
  incrementSorteGamesInDatabase,
  SortedResponse,
  sortThreeGames,
} from './functions';
import IgdbService from './services/igdb.service';
import { CronJob } from 'cron'

const bot = new Telegraf(process.env.BOT_TOKEN || '');
bot.launch({
  webhook: {
    domain: process.env.WEBHOOK_URL,
    port: parseInt(process.env.PORT || '0', 10) ?? 80,
  },
});

console.log(`Webhook set to ${process.env.WEBHOOK_URL}`);

var job = new CronJob(
  '0 0 * * 6',
  async function () {
    const chatId = process.env.CHAT_ID ?? 0;
    const res = await sortThreeGames() as SortedResponse;
    const msg = await bot.telegram.sendMediaGroup(chatId, res.mediaGroupMsg);
    await bot.telegram.pinChatMessage(chatId, msg[0].message_id);
    await incrementSorteGamesInDatabase(res.ids);
  },
  null,
  true,
  'America/Los_Angeles'
);

job.start()

bot.command('count', async (ctx) => ctx.reply(await getTotalGames(ctx)));
bot.command('consoles', async (ctx) => ctx.reply(await getTotalSortedByConsole(ctx)));
bot.command('genres', async (ctx) => ctx.reply(await getTotalSortedByGenre(ctx)));
bot.command('games', async (ctx) => ctx.replyWithMarkdown(await getTotalSortedGames(ctx), { disable_web_page_preview: true }));
bot.command('sort', async (ctx) => await sortThreeGames(ctx));
bot.on('inline_query', async (ctx) => new IgdbService(ctx).run(ctx.inlineQuery));

export default bot;
