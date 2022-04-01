import 'newrelic';
import 'dotenv/config';
import bot from './bot';

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
