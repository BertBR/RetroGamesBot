const { bot } = require('./webhook')
const math = require('mathjs')
var http = require("http")

const today = new Date().getDay()

bot.on('message', (msg) => {
	const IntRand = () => { return math.randomInt(226, 3445) }
	const chatId = msg.chat.id
	const fileNames = []
	const links = []
	let i = 0
	
	let adminId = 318475027
	
	setInterval(function() {
	  http.get("http://retrogamesbot.herokuapp.com")
	  .then(res => console.log('RES:', res))
	  if (today === 6) {
		  main()
	  }
  }, 900000); // every 15 minutes (900000)

	//Sortear Games
	if(msg.text === `/sortear@retrogamesbr_bot` && msg.from.id === adminId)	
	{
		main();
	}
	//Check Bot Status
	if(msg.text === '/status@retrogamesbr_bot'){
		bot.sendMessage(chatId, `Olá *${msg.from.first_name}*.\nBot online!\n${new Date()} `, {parse_mode: "Markdown"})
	}
	//Check Adminlist
	if(msg.text === '/adminlist@retrogamesbr_bot'){
		let list = []
		bot.getChatAdministrators(chatId)
		.then(admins => {
			admins.forEach((item) => {
				if(item.user.is_bot === false){
					list.push(item.user.first_name)	
				}
			})		
			 list = list.toString().split(',').join('\n')
			 bot.sendMessage(chatId, `Olá ${msg.from.first_name}, aqui está a lista de Admins:\n\n${list}`)
			})
		}

	async function main(){
		try{
			if(today === 6) {
				while(i<3){
					const File = await sortGame({i:i})	
					fileNames[i] = File.document.file_name
					links[i] = File.caption
					i++		
				}
				createPoll({fileNames, links})
			}else{
				bot.sendMessage(chatId, "Hoje não é dia de sortear os jogos! Por favor aguarde até sábado.")
			}	
		}
		catch(error){
			console.error("Deu ruim!", error)
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
	function createPoll({fileNames, links}){
		let question =  "Escolha o próximo jogo da Maratona Retrô (Semanal)"
		return new Promise (function resolvePromise(resolve, reject) {
			return resolve (
				bot.sendMessage(chatId, `${question}:\n\n1️⃣ - [${fileNames[0]}](${links[0]})\n2️⃣ - [${fileNames[1]}](${links[1]})\n3️⃣ - [${fileNames[2]}](${links[2]})`, 
				{parse_mode: "Markdown" , disable_web_page_preview: "true"})
				.then(msg => {
					bot.pinChatMessage(chatId, msg.message_id)
				})	
			)
		})
	}
})