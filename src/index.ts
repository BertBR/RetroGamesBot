import 'dotenv/config'
import bot from './bot'

console.log("Bot is running...")
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))