/* eslint-disable no-console */

import app from './config/serviceAccount';

export class GetData {
  private db = app.firestore();

  public async topTen(ctx: any, flag: string, order: string) {

    const topRef = this.db.collection('games')
      .where('sorted', '>', 0)
      .orderBy('sorted', 'desc')
      .limit(10);

    const topTen = await topRef.get();

    const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
    let top: any[] = [];
    let caption = '';

    topTen.forEach((game) => {
      top.push(game.data())
    });

    top.forEach((item, index) => {
        caption = caption + `${numbers[index]} [${item.title}](${item.file_url})  (${item.console}) - **${item.sorted}**\n`;
    });

    const question = `Olá ${ctx.message?.from?.first_name}\nAqui está a lista dos TOP 10 ${flag} mais sorteados!`;
    ctx.replyWithMarkdown(`${question}\n\n${caption}`);
  }

}

