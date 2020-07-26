import * as functions from 'firebase-functions';
import {bot} from './bot'
import {getAdminList, sortGame} from './functions'

bot.launch()
bot.on('text', (ctx) => {
const msg = ctx.message;

const chatId = msg?.chat.id;

const adminId = 318475027;

let i = 0;

const fileNames: any[] = [];

const links: any[] = [];

const arrPhoto: any[] = [];

async function main() {
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
    if (msg?.text === '/sortear') {
      if (msg?.from?.id === adminId) {
        while (i < 3) {
          console.log(i);
          await sortGame(i, bot, chatId, fileNames, links, arrPhoto);
          i++;
        }
      } else {
        ctx.reply(
          'Você não tem permissão pra executar esse comando, pare de querer chamar atenção e vá jogar! xD',
        );
      }
    }
  } catch (error) {
    console.error('Deu ruim!', error);
  }
}

main();
});

export const sortGames = functions.https.onRequest((request, response) => {
  console.log('Running...')
 
});