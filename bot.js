const TOKEN = '458733904:AAH-Fq8ABp5xVpLHf32uxKAbP-nMCLf4mgU';
const TelegramBot = require('node-telegram-bot-api');
const url = 'https://retrogamesbot.herokuapp.com';
const bot = new TelegramBot(TOKEN, options);

bot.setWebHook(`${url}/${TOKEN}`);


// Just to ping!
bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg.chat.i
const today = new Date().getDay()

bot.on('message', (msg) => {
	const IntRand = () => { return math.randomInt(226, 3445) }
	const chatId = msg.chat.id
	const sortGame = () => {
		let id,url,stats
		id = IntRand()
		url = `https://t.me/virtualroms/${id}`
		bot.sendPhoto(chatId, url, {caption: url}).catch(err => sortGame())
	}

if(today === 4) {
	let i = 0
	while(i<3){
		sortGame()
		i++
		console.log(i)
	}
}
})
