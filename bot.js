/**
 * This example demonstrates setting up webhook
 * on the Heroku platform.
 */


const TOKEN = process.env.TELEGRAM_TOKEN || '458733904:AAH-Fq8ABp5xVpLHf32uxKAbP-nMCLf4mgU';
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
    // Port to which you should bind is assigned to $PORT variable
    // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
    port: process.env.PORT
    // you do NOT need to set up certificates since Heroku provides
    // the SSL certs already (https://<app-name>.herokuapp.com)
    // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
  }
};
// Heroku routes from port :443 to $PORT
// Add URL of your app to env variable or enable Dyno Metadata
// to get this automatically
// See: https://devcenter.heroku.com/articles/dyno-metadata
const url = process.env.APP_URL || 'https://retrogamesbot.herokuapp.com';
const bot = new TelegramBot(TOKEN, options);


// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);


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
