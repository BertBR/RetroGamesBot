import Telegraf from 'telegraf';
import * as functions from 'firebase-functions';

let config = functions.config();

const bot = new Telegraf(config.bot.token);

// bot.launch()

export default bot;