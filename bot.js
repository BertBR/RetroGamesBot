const TelegramBot = require('node-telegram-bot-api')
const math = require('mathjs')
const WebOptions = {
	webHook: {
	  // Port to which you should bind is assigned to $PORT variable
	  // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
	  port: process.env.PORT || '3000'
	  // you do NOT need to set up certificates since Heroku provides
	  // the SSL certs already (https://<app-name>.herokuapp.com)
	  // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
	}
  };
  // Heroku routes from port :443 to $PORT
  // Add URL of your app to env variable or enable Dyno Metadata
  // to get this automatically
  // See: https://devcenter.heroku.com/articles/dyno-metadata
const WebHookUrl = process.env.APP_URL || 'https://retrogamesbot.herokuapp.com';
const TOKEN = process.env.TELEGRAM_TOKEN || '802150654:AAFx1hczbT2x31udxP_xfvQQ2bw9kCRsZ00';
const bot = new TelegramBot(TOKEN, WebOptions);
bot.setWebHook(`${WebHookUrl}/bot${TOKEN}`)
const today = new Date().getDay()

bot.on('message', (msg) => {
	const IntRand = () => { return math.randomInt(226, 3445) }
	const chatId = msg.chat.id
	const fileNames = []
	const links = []
	let i = 0
	
	let adminId = 318475027

	if(msg.text === '/sortear' && msg.from.id === adminId)	
	{
		main();
	}

	async function main(){
		try{
			if(today === 6) {
				while(i<3){
					const File = await sortGame({i:i})	
					fileNames[i] = File.document.file_name
					links[i] =File.caption
					i++		
				}
				//console.log(fileNames)
				//console.log(links)
				createPoll({fileNames})
			}	
		}
		catch(error){
			console.log("Deu ruim!")
		}
	}
	function sortGame({i}){
		let id,url
		id = IntRand()
		url = `https://t.me/virtualroms/${id}`
		return new Promise (function resolvePromise(resolve, reject) {
				return resolve (
					bot.sendDocument(chatId, url, {caption: url}).catch(err => sortGame({i:i}))
			)
		})
	}
	function createPoll({fileNames}){
		let question =  "Escolha o próximo jogo da Maratona Retrô (Semanal)"
		return new Promise (function resolvePromise(resolve, reject) {
			return resolve (
				bot.sendMessage(chatId, `*${question}:*\n\n1️⃣ - [${fileNames[0]}](${links[0]})\n2️⃣ - [${fileNames[1]}](${links[1]})\n3️⃣ - [${fileNames[2]}](${links[2]})`, 
				{parse_mode: "Markdown", disable_web_page_preview: "true"})
				.then(msg => {
					bot.pinChatMessage(chatId, msg.message_id)
				})	
			)
		})
	}
})