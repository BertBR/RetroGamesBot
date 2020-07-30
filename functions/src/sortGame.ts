/* eslint-disable no-console */

import * as math from 'mathjs';
import bot, {config} from './bot';
import app from './config/serviceAccount';
import { firestore } from 'firebase-admin';

export class SortGame {

  private db = app.firestore();

  public sortThree() {

    let i = 0;
    let urls: any[] = [];

    while (i < 3) {
      const id = math.randomInt(1, 5);
      urls.push(`https://t.me/virtualroms/${id}`);
      i++;
    }

    let filteredUrls = (urls: any[]) => urls.filter((v, i) => urls.indexOf(v) === i);

    if (filteredUrls(urls).length !== 3) {
      i = filteredUrls(urls).length;
      this.sortThree()
    } else {
      this.getGames(filteredUrls(urls));
    }
  }

  private async getGames(url: any[]) {

    let games: any[] = []

    try {
      const snapshot = await this.db.collection('games').where('file_url', 'in', url).get();
      snapshot.forEach(doc => {
        const data = {
          id: doc.id,
          ...doc.data()
        }
        games.push(data);
      });

      games.forEach(async (game) => {
        await this.db.collection('games').doc(game.id).update({
          sorted: firestore.FieldValue.increment(1)
        })
      })

      this.createMsgtoPin(bot, games);

    } catch (error) {
      console.log("error is ", error);
    }
  }

  private createMsgtoPin(bot: any, games: any[]) {

    const question = 'Estes foram os jogos sorteados para a Maratona Retrô (Semanal)';
    const caption = `${question}:\n\n
    1️⃣ - [${games[0].title} - ${games[0].console}](${games[0].file_url})\n
    2️⃣ - [${games[1].title} - ${games[1].console}](${games[1].file_url})\n
    3️⃣ - [${games[2].title} - ${games[2].console}](${games[2].file_url})`;

    const chatId = config.bot.chat

    bot.telegram.sendMediaGroup(chatId, [
      {
        media: games[0].image_url,
        caption,
        parse_mode: 'Markdown',
        disable_web_page_preview: 'true',
        type: 'photo',
      },
      {
        media: games[1].image_url,
        type: 'photo',
      },
      {
        media: games[2].image_url,
        type: 'photo',
      },
    ])
      .then((msg: any) => {
        bot.telegram.pinChatMessage(chatId, msg[0].message_id);
      });
  }

}