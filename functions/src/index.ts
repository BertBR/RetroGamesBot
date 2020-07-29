import * as functions from 'firebase-functions';
import bot from './bot'

import { sortGame, getAdminList } from './functions'

bot.launch()
bot.on('text', async (ctx) => {
  const msg = ctx.message;

  const chatId = msg?.chat.id;

  const adminId = 318475027;

  try {
    // Check Bot Status
    if (msg?.text === '/status') {
      ctx.reply(
        `Olá *${msg?.from?.first_name}*.\nBot online!\n${new Date()} `,
        { parse_mode: 'Markdown' },
      );
    }

    // Check Adminlist
    if (msg?.text === '/adminlist') {
      getAdminList(bot, ctx, chatId);
    }

    // Sortear Games
    if (msg?.text === '/sortear@retrogamesbr_bot') {
      if (msg?.from?.id === adminId) {
         await sortGame(); 
      } else {
        ctx.reply(
          'Você não tem permissão pra executar esse comando, pare de querer chamar atenção e vá jogar! xD',
        );
      }
    }
  } catch (error) {
    console.error('Deu ruim!', error);
  }

});


export const sortGames = functions.pubsub.schedule('5 0 * * 6')
  .timeZone('America/Sao_Paulo')
  .onRun(() => {
      sortGame();
    return true;

  });