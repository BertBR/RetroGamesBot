import Telegraf from 'telegraf';
import * as functions from 'firebase-functions';

export const config = functions.config();
const bot = new Telegraf(config.bot.token);

export default bot;