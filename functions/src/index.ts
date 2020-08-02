import * as functions from 'firebase-functions';
import bot from './bot'
import { SortGame } from './sortGame'
import { GetTop10Data } from './getGameData'
import { Context } from 'telegraf';

const sort = new SortGame();
const getTop10 = new GetTop10Data();

bot.on('text', (ctx: Context) => {
  try {
    if (ctx.message?.text === '/games@retrogamesbr_bot') {
      getTop10.topGames(ctx, 'games');
    }
    if (ctx.message?.text === '/consoles@retrogamesbr_bot') {
      getTop10.topConsoles(ctx, 'consoles');
    }
    if (ctx.message?.text === '/genders@retrogamesbr_bot') {
      getTop10.topGenders(ctx, 'consoles');
    }
  } catch (error) {
    console.error('Error: ', error);
  }
})

export const sortGames = functions.pubsub.schedule('5 0 * * 6')
  .timeZone('America/Sao_Paulo')
  .onRun(() => {
    sort.sortThree();
    return true;
  });