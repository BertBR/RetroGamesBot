/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const { bot } = require('./web');

const { getAdminList, sortGame } = require('./functions');

bot.on('text', (ctx) => {
  const msg = ctx.message;

  const chatId = msg.chat.id;

  const adminId = 318475027;

  let i = 0;

  const fileNames = [];

  const links = [];

  const arrPhoto = [];

  async function main() {
    try {
      // Check Bot Status
      if (msg.text === '/status@retrogamesbr_bot') {
        ctx.reply(
          `Olá *${msg.from.first_name}*.\nBot online!\n${new Date()} `,
          { parse_mode: 'Markdown' },
        );
      }

      // Check Adminlist
      if (msg.text === '/adminlist@retrogamesbr_bot') {
        getAdminList(bot, ctx, chatId);
      }

      // Sortear Games
      if (msg.text === '/sortear@retrogamesbr_bot') {
        if (msg.from.id === adminId) {
          while (i < 3) {
            console.log(i);
            await sortGame(i, bot, chatId, fileNames, links, arrPhoto);
            i++;
          }
        } else {
          ctx.reply(
            'Você não tem permissão pra executar esse comando, pare de querer chamar atenção e vá jogar! xD',
          );
        }
      }
    } catch (error) {
      console.error('Deu ruim!', error);
    }
  }

  main();
});
