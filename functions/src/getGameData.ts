/* eslint-disable no-console */

import app from './config/serviceAccount';
import { Context } from 'telegraf';
export class GetTop10Data {
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
      caption = caption + `${this.numbers[index]} ${item.console} - **${item.sorted}**\n`;
    });

    const question = `Olá ${ctx.message?.from?.first_name}\nAqui está a lista dos TOP 10 ${flag} mais sorteados!`;
    ctx.replyWithMarkdown(`${question}\n\n${caption}`);
  }

  public async topGenders(ctx: Context, flag: string) {

    const topTen = await this.topRef.select('sorted', 'gender').get();
    let top: any[] = [];
    let caption = '';

    topTen.forEach((game) => {
      top.push(game.data());
    });

    const topGenders = this.createTop10(top, 'gender', 'sorted');

    topGenders.forEach((item: any, index) => {
      caption = caption + `${this.numbers[index]} ${item.gender} - **${item.sorted}**\n`;
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

}