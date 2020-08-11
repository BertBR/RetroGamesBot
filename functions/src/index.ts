import * as functions from 'firebase-functions';
import app from './server';
import bot from './bot';
import { GamesDAO } from './dataaccess/games.dao';
const dataAccess: GamesDAO = new GamesDAO();

bot.hears('/games@retrogamesbr_bot', (ctx) => dataAccess.topGames(ctx, 'games'));
bot.hears('/count@retrogamesbr_bot', (ctx) => dataAccess.countGames(ctx));
bot.hears('/consoles@retrogamesbr_bot', (ctx) => dataAccess.topConsoles(ctx, 'consoles'));
bot.hears('/genres@retrogamesbr_bot', (ctx) => dataAccess.topGenres(ctx, 'genres'));
bot.launch();

export const api = functions.https.onRequest(app);

export const sortGames = functions.pubsub.schedule('5 0 * * 6')
  .timeZone('America/Sao_Paulo')
  .onRun(() => {
    dataAccess.sortThree()
    return true;
  });