const TelegramBot = require('node-telegram-bot-api')
const WebOptions = {
	webHook: {
	  port: process.env.PORT || '3000'
	}
  }
const WebHookUrl = process.env.APP_URL ||  'https://retrogamesbot.herokuapp.com'; //HEROKU WEBHOOK
"https://18ded883.ngrok.io" //NGROK WEBHOOK
const TOKEN = process.env.TELEGRAM_TOKEN || '802150654:AAFx1hczbT2x31udxP_xfvQQ2bw9kCRsZ00'; //TOKEN @RETROGAMES_BOT
'458733904:AAH-Fq8ABp5xVpLHf32uxKAbP-nMCLf4mgU' //TOKEN BERTINNN_BOT

const bot = new TelegramBot(TOKEN, WebOptions);
bot.setWebHook(`${WebHookUrl}/bot${TOKEN}`)

module.exports = {
    bot
}