import * as functions from 'firebase-functions';
import bot from './bot'
import { SortGame } from './sortGame'
import { GetData } from './getGameData'

const sort = new SortGame();
const getData = new GetData();

bot.on('text', (ctx) => {

  try {
    if(ctx.message?.text === '/games@retrogamesbr_bot'){
      getData.topTen(ctx, 'games', 'games');
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