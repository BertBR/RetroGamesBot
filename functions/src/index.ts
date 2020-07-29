import * as functions from 'firebase-functions';
import { sortGame } from './sortGame'

const sort = new sortGame();

export const sortGames = functions.pubsub.schedule('5 0 * * 6')
  .timeZone('America/Sao_Paulo')
  .onRun(() => {
    sort.sortThree();
    return true;

  });