/* eslint-disable no-console */

import * as math from 'mathjs'
import bot from './bot'
import app from './config/serviceAccount'

const db = app.firestore()

export async function createMsgtoPin(bot: any, games: any[]) {
  const question = 'Estes foram os jogos sorteados para a Maratona Retrô (Semanal)';
  const caption = `${question}:\n\n1️⃣ - [${games[0].title}](${games[0].file_url})\n2️⃣ - [${games[1].title}](${games[1].file_url})\n3️⃣ - [${games[2].title}](${games[2].file_url})`;

  const chatId = -1001297582723;

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

export async function sortGame() {

  let i = 0;
  let url: any[] = []
  let games: any[] = [];

  function sortThree(i: number) {
    while (i < 3) {
      const id = math.randomInt(1, 4);
      url.push(`https://t.me/virtualroms/${id}`);
      i++;
    }
  }

  sortThree(i);
  console.log(url.length)

  if(url.length < 3){
    i = 2;
    sortThree(i);
  }

  console.log(url.length)



  try {
    const snapshot = await db.collection('games').where('file_url', 'in', url).get()
    snapshot.forEach(doc => {
      games.push(doc.data())
    })
    console.log(games)
    createMsgtoPin(bot, games);

  } catch (error) {
    console.log("error is ", error)
  }
}

export function getAdminList(bot: any, ctx: any, chatId: any) {
  let list: any = [];

  ctx.getChatAdministrators(chatId)

    .then((admins: any[]) => {
      admins.forEach((item) => {
        if (item.user.is_bot === false) {
          list.push(item.user.first_name);
        }
      });

      list = list.toString().split(',').join('\n');

      bot.telegram.sendMessage(chatId, `Olá ${ctx.message.from.first_name}, aqui está a lista de Admins:\n\n${list}`);
    });
}