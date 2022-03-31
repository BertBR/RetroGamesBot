// eslint-disable-next-line import/no-unresolved
import Context from 'telegraf/typings/context';
// eslint-disable-next-line import/no-unresolved
import { Update } from 'telegraf/typings/core/types/typegram';
import Cache from './config/caching';
import Database from './config/database_connection';

const numbers = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣',
  '🔟',
];
const cache = new Cache();
const db = new Database();

type GamesCache = {
  total: number,
  data: string
}

export const getTotalGames = async (ctx: Context<Update>) => {
  const isCached = await cache.get('getTotalGames') as GamesCache;
  let greetings = '';
  if (isCached) {
    greetings = `Olá ${ctx.from?.first_name}.\nTotal de ${isCached.total} jogos cadastrados na base!\n\n`;
    return greetings + isCached.data;
  }
  const total = await db.getTotalGames();
  const res = await db.getTotalGamesCountByConsole();
  greetings = `Olá ${ctx.from?.first_name}.\nTotal de ${total.rows[0].count} jogos cadastrados na base!\n\n`;
  let data = '';
  res.rows.forEach((r) => {
    data += `${r.console} : ${r.count}\n`;
  });
  cache.set('getTotalGames', { total: total.rows[0].count, data });
  return greetings + data;
};

export const getTotalSortedByConsole = async (ctx: Context<Update>) => {
  const isCached = await cache.get('getTotalSortedByConsole') as GamesCache;
  let greetings = `Olá ${ctx.from?.first_name}.\nAqui está a lista dos TOP 10 consoles mais sorteados!\n\n`;

  if (isCached) {
    greetings = `Olá ${ctx.from?.first_name}.\nAqui está a lista dos TOP 10 consoles mais sorteados!\n\n`;
    return greetings + isCached.data;
  }

  const res = await db.getTotalSortedBy('console');
  let data = '';
  res.rows.forEach((r, i) => {
    data += `${numbers[i]} ${r.console.toUpperCase()} : ${r.sum}\n`;
  });
  cache.set('getTotalSortedByConsole', data);

  return greetings + data;
};

export const getTotalSortedByGenre = async (ctx: Context<Update>) => {
  const isCached = await cache.get('getTotalSortedByGenre') as GamesCache;
  let greetings = `Olá ${ctx.from?.first_name}.\nAqui está a lista dos TOP 10 gêneros mais sorteados!\n\n`;
  if (isCached) {
    greetings = `Olá ${ctx.from?.first_name}.\nAqui está a lista dos TOP 10 gêneros mais sorteados!\n\n`;
    return greetings + isCached.data;
  }
  const res = await db.getTotalSortedBy('genre');
  let data = '';
  res.rows.forEach((r, i) => {
    data += `${numbers[i]} ${r.genre.toUpperCase()} : ${r.sum}\n`;
  });
  cache.set('getTotalSortedByGenre', data);

  return greetings + data;
};

export const getTotalSortedGames = async (ctx: Context<Update>) => {
  const isCached = await cache.get('getTotalSortedGames') as GamesCache;
  let greetings = `Olá ${ctx.from?.first_name}.\nAqui está a lista dos TOP 10 games mais sorteados!\n\n`;
  if (isCached) {
    greetings = `Olá ${ctx.from?.first_name}.\nAqui está a lista dos TOP 10 games mais sorteados!\n\n`;
    return greetings + isCached.data;
  }
  const res = await db.getTotalSortedGames();
  let data = '';
  res.rows.forEach((r, i) => {
    data += `${numbers[i]} [${r.title}](${r.image_url}) : ${r.sum}\n`;
  });
  cache.set('getTotalSortedGames', data);

  return greetings + data;
};

export const sortThreeGames = async (ctx: Context<Update>) => {
  const chatId = parseInt(process.env.CHAT_ID || '0', 10);
  const adminId = parseInt(process.env.ADMIN_ID || '0', 10);

  if (ctx.from?.id !== adminId) {
    ctx.reply('Você não tem permissão para executar esta ação!');
    return;
  }

  const res = await db.getThreeRandomGames();
  const caption = `Estes foram os jogos sorteados para a Maratona Retrô (Semanal):\n\n
1️⃣ - [${res.rows[0].title}](${res.rows[0].file_url}) (${res.rows[0].genre})\n
2️⃣ - [${res.rows[1].title}](${res.rows[1].file_url}) (${res.rows[1].genre})\n
3️⃣ - [${res.rows[2].title}](${res.rows[2].file_url}) (${res.rows[2].genre})`;

  const msg = await ctx.telegram.sendMediaGroup(
    chatId,
    [
      {
        media: res.rows[0].image_url,
        caption,
        type: 'photo',
        parse_mode: 'Markdown',
      },
      {
        media: res.rows[1].image_url,
        type: 'photo',
      },
      {
        media: res.rows[2].image_url,
        type: 'photo',
      },
    ],
  );

  await ctx.telegram.pinChatMessage(chatId, msg[0].message_id);
  await ctx.telegram.sendMessage(adminId, caption, { parse_mode: 'Markdown', disable_web_page_preview: true });

  await db.incrementSortedGames([res.rows[0].id, res.rows[1].id, res.rows[2].id]);
};
