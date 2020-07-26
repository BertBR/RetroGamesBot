import Telegraf from 'telegraf';
import * as functions from 'firebase-functions';

let config = require('./env.json');

if (Object.keys(functions.config()).length) {
  config = functions.config();
}

export const bot = new Telegraf(config.bot.token);
