/* eslint-disable no-console */

import * as math from 'mathjs'

export async function createMsgtoPin(bot: any, chatId: any, fileNames: any, links: any, arrPhoto: any[]) {
  const question = 'Estes foram os jogos sorteados para a Maratona Retrô (Semanal)';
  const caption = `${question}:\n\n1️⃣ - [${fileNames[0]}](${links[0]})\n2️⃣ - [${fileNames[1]}](${links[1]})\n3️⃣ - [${fileNames[2]}](${links[2]})`;

  bot.telegram.sendMediaGroup(chatId, [
    {
      media: arrPhoto[0],
      caption,
      parse_mode: 'Markdown',
      disable_web_page_preview: 'true',
      type: 'photo',
    },
    {
      media: arrPhoto[1],
      type: 'photo',
    },
    {
      media: arrPhoto[2],
      type: 'photo',
    },
  ])
    .then((msg: any) => {
      bot.telegram.pinChatMessage(chatId, msg[0].message_id);
    });
}

export async function sortGame(i: number, bot: any, chatId: any, fileNames: any, links: any, arrPhoto: any[]) {
  const id = math.randomInt(226, 3445);

  const url = `https://t.me/virtualroms/${id}`;

  const urlPhoto = `https://t.me/virtualroms/${id - 1}`;

  try {
    const msg = await bot.telegram.sendDocument(chatId, url, { caption: url });
    await bot.telegram.deleteMessage(chatId, msg.message_id);

    fileNames.push(msg.document.file_name
      .replace(/\[NeoGeo]_/, '')
      .replace(/\.\w+/, '')
      .split('_').join(' '));

    console.log(fileNames[i]);

    links.push(msg.caption);

    const msgPhoto = await bot.telegram.sendPhoto(chatId, urlPhoto);
    await bot.telegram.deleteMessage(chatId, msgPhoto.message_id);

    arrPhoto.push(msgPhoto.photo[0].file_id);

    if (i === 2) {
      createMsgtoPin(bot, chatId, fileNames, links, arrPhoto);
    }
  } catch (error) {
    await sortGame(i, bot, chatId, fileNames, links, arrPhoto);
  }
}

export function getAdminList(bot:any, ctx:any, chatId:any) {
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