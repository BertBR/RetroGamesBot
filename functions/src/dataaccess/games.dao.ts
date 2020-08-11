import {firestore} from 'firebase-admin'
import app from '../config/serviceAccount';
import * as math from 'mathjs';
import bot, {config} from '../bot';
import { Context } from 'telegraf';
import { Game } from '../models/game.model';

export class GamesDAO {
  
  private db = app.firestore();
  private numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
  private topRef = this.db.collection('games')
    .where('sorted', '>', 0)
    .orderBy('sorted', 'desc')
    .limit(10);

  public async topGames(ctx: Context, flag: string) {

    const topTen = await this.topRef.get();
    let top: any[] = [];
    let caption = '';

    topTen.forEach((game) => {
      top.push(game.data())
    });

    top.forEach((item, index) => {
      caption = caption + `${this.numbers[index]} [${item.title}](${item.file_url})  (${item.console}) - **${item.sorted}**\n`;
    });

    const question = `Olá ${ctx.message?.from?.first_name}\nAqui está a lista dos TOP 10 ${flag} mais sorteados!`;
    ctx.replyWithMarkdown(`${question}\n\n${caption}`);
  }

  public async topConsoles(ctx: Context, flag: string) {

    const topTen = await this.topRef.select('sorted', 'console').get();
    let top: any[] = [];
    let caption = '';

    topTen.forEach((game) => {
      top.push(game.data());
    });

    const topConsoles = this.createTop10(top, 'console', 'sorted');

    topConsoles.forEach((item: any, index) => {
      caption = caption + `${this.numbers[index]} ${String(item.console).toUpperCase()} - **${item.sorted}**\n`;
    });

    const question = `Olá ${ctx.message?.from?.first_name}\nAqui está a lista dos TOP 10 ${flag} mais sorteados!`;
    ctx.replyWithMarkdown(`${question}\n\n${caption}`);
  }

  public async topGenres(ctx: Context, flag: string) {

    const topTen = await this.topRef.select('sorted', 'genre').get();
    let top: any[] = [];
    let caption = '';

    topTen.forEach((game) => {
      top.push(game.data());
    });

    const topGenders = this.createTop10(top, 'genre', 'sorted');

    topGenders.forEach((item: any, index) => {
      caption = caption + `${this.numbers[index]} ${String(item.genre).toUpperCase()} - **${item.sorted}**\n`;
    });

    const question = `Olá ${ctx.message?.from?.first_name}\nAqui está a lista dos TOP 10 ${flag} mais sorteados!`;
    ctx.replyWithMarkdown(`${question}\n\n${caption}`);
  }

  private createTop10(arr: any[], key1: any, key2: any) {
    let holder: any = {};

    arr.forEach(d => {
      if (holder.hasOwnProperty(d[`${key1}`])) {
        holder[d[`${key1}`]] = holder[d[`${key1}`]] + d[`${key2}`];
      } else {
        holder[d[`${key1}`]] = d[`${key2}`];
      }
    });

    let obj2 = [];

    for (let prop in holder) {
      obj2.push({ [key1]: prop, [key2]: holder[prop] });
    }

    return obj2;
  }


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

      this.createMsgToPin(bot, games);

    } catch (error) {
      console.log("error is ", error);
    }
  }

  private createMsgToPin(bot: any, games: any[]) {

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

  // Database
  public async create(game: Game) {

    const id = await this.db.collection('games').add({
      ...game,
      sorted: 0
    })

    return id;
  }

  public async listAll(): Promise<Array<Game>> {
    let games: any[] = [];

    const snapshot = await this.db.collection('games').get();

    snapshot.forEach((game) => {
      games.push(game.data())
    });

    return games;
  }

  public async countGames(ctx: Context) {
    const snapshot = await this.db.collection('games').get();

    const total = snapshot.size

    return ctx.replyWithMarkdown(`Total de ${total} jogos cadastrados na base!`);
  }

}