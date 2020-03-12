const math = require('mathjs')

function sortGame (i, bot, chatId, fileNames, links, arrPhoto) {
  const IntRand = () => { return math.randomInt(226, 3445) }

  const id = IntRand()

  const url = `https://t.me/virtualroms/${id}`

  const urlPhoto = `https://t.me/virtualroms/${id - 1}`

  return new Promise(function resolvePromise (resolve, reject) {
    return resolve(

      bot.telegram.sendDocument(chatId, url, { caption: url }).then(async msg => {
        fileNames.push(msg.document.file_name)

        console.log(fileNames[i])

        links.push(msg.caption)

        await bot.telegram.deleteMessage(chatId, msg.message_id)

        await bot.telegram.sendPhoto(chatId, urlPhoto)
          .then(msg => {
            arrPhoto.push(msg.photo[0].file_id)

            bot.telegram.deleteMessage(chatId, msg.message_id)
          })
          .then(msg => {
            if (i === 2) {
              createMsgtoPin(bot, chatId, fileNames, links, arrPhoto)
            }
          })
      }).catch(err => sortGame(i, bot, chatId, fileNames, links, arrPhoto))
    )
  })
}

function createMsgtoPin (bot, chatId, fileNames, links, arrPhoto) {
  const question = 'Estes foram os jogos sorteados para a Maratona Retrô (Semanal)'
  const caption = `${question}:\n\n1️⃣ - [${fileNames[0]}](${links[0]})\n2️⃣ - [${fileNames[1]}](${links[1]})\n3️⃣ - [${fileNames[2]}](${links[2]})`

  bot.telegram.sendMediaGroup(chatId, [
    {
      media: arrPhoto[0],
      caption: caption,
      parse_mode: 'Markdown',
      disable_web_page_preview: 'true',
      type: 'photo'
    },
    {
      media: arrPhoto[1],
      type: 'photo'
    },
    {
      media: arrPhoto[2],
      type: 'photo'
    }
  ])
    .then((msg) => {
      bot.telegram.pinChatMessage(chatId, msg[0].message_id)
    })
}

function getAdminList (bot, ctx, chatId) {
  let list = []

  ctx.getChatAdministrators(chatId)

    .then(admins => {
      admins.forEach((item) => {
        if (item.user.is_bot === false) {
          list.push(item.user.first_name)
        }
      })

      list = list.toString().split(',').join('\n')

      bot.telegram.sendMessage(chatId, `Olá ${ctx.message.from.first_name}, aqui está a lista de Admins:\n\n${list}`)
    })
}

module.exports = {
  sortGame, getAdminList
}
