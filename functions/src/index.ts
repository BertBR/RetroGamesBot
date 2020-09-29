import * as functions from 'firebase-functions';
import app from './server';
import { GamesDAO } from './dataaccess/games.dao';
const dataAccess: GamesDAO = new GamesDAO();

export const api = functions.https.onRequest(app);

export const sortGames = functions.pubsub.schedule('5 0 * * 6')
  .timeZone('America/Sao_Paulo')
  .onRun(() => {
    dataAccess.sortThree()
    return true;
  });
