import { firestore } from "firebase-admin";
import axios from "axios";
import app from "../config/serviceAccount";
import bot, { config } from "../bot";
import { Game } from "../models/game.model";
import { InlineQueryResultArticle } from "telegraf/typings/telegram-types";
import { Cache } from "../config/caching";
export class GamesDAO {
  private db = app.firestore();
  private cache = new Cache();
  private numbers = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
  ];
  private topRef = this.db
    .collection("games")
    .where("sorted", ">", 0)
    .orderBy("sorted", "desc");

  private async updateCache(key: string) {
    let top: any[] = [];
    let list = "";

    const snapshot = await this.db.collection("games").get();
    snapshot.forEach((doc) => {
      top.push(doc.data().console);
    });

    const countByConsoles = top.reduce((prev: any, cur: any) => {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});

    const sortable = Object.entries(countByConsoles)
      .sort(([, a]: any, [, b]: any) => b - a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    Object.entries(sortable).forEach(
      (item) => (list = list + `${item.join(" : ")}\n`)
    );

    const total = snapshot.size;

    this.cache.set(key, [total, list]);

    return [total, list];
  }

  private buildCacheMessage(message: any, total: any, list: any) {
    return bot.telegram.sendMessage(
      message.chat.id,
      `Total de ${total} jogos cadastrados na base!\n\n${list}`,
      { parse_mode: "Markdown" }
    );
  }

  public async countGames(message: any) {
    let isCached: any = await this.cache.get("count");

    if (!isCached) {
      const [total, list] = await this.updateCache("count");
      return this.buildCacheMessage(message, total, list);
    }
    return this.buildCacheMessage(message, isCached[0], isCached[1]);
  }

  public async topGames(message: any, flag: string) {
    const topTen = await this.topRef.limit(10).get();
    let top: any[] = [];
    let caption = "";

    topTen.forEach((game) => {
      top.push(game.data());
    });

    top.forEach((item, index) => {
      if (this.numbers[index]) {
        caption =
          caption +
          `${this.numbers[index]} [${item.title}](${item.file_url}) - **${item.sorted}**\n`;
      }
    });

    const question = `Olá ${message.from.first_name}\nAqui está a lista dos TOP 10 ${flag} mais sorteados!`;
    bot.telegram.sendMessage(message.chat.id, `${question}\n\n${caption}`, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  }

  public async topConsoles(message: any, flag: string) {
    const topTen = await this.topRef.select("sorted", "console").get();
    let top: any[] = [];
    let caption = "";

    topTen.forEach((game) => {
      top.push(game.data());
    });

    const topConsoles = this.createTop10(top, "console", "sorted");

    topConsoles.forEach((item: any, index) => {
      if (this.numbers[index]) {
        caption =
          caption +
          `${this.numbers[index]} ${String(item.console).toUpperCase()} - **${
            item.sorted
          }**\n`;
      }
    });

    const question = `Olá ${message.from.first_name}\nAqui está a lista dos TOP 10 ${flag} mais sorteados!`;
    bot.telegram.sendMessage(message.chat.id, `${question}\n\n${caption}`, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  }

  public async topGenres(message: any, flag: string) {
    const topTen = await this.topRef.select("sorted", "genre").get();
    let top: any[] = [];
    let caption = "";

    topTen.forEach((game) => {
      top.push(game.data());
    });

    const topGenders = this.createTop10(top, "genre", "sorted");

    topGenders.forEach((item: any, index) => {
      if (this.numbers[index]) {
        caption =
          caption +
          `${this.numbers[index]} ${String(item.genre).toUpperCase()} - **${
            item.sorted
          }**\n`;
      }
    });

    const question = `Olá ${message.from.first_name}\nAqui está a lista dos TOP 10 ${flag} mais sorteados!`;
    bot.telegram.sendMessage(message.chat.id, `${question}\n\n${caption}`, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  }

  private createTop10(arr: any[], key1: any, key2: any) {
    let holder: any = {};

    arr.forEach((d) => {
      if (holder.hasOwnProperty(d[`${key1}`])) {
        holder[d[`${key1}`]] = holder[d[`${key1}`]] + d[`${key2}`];
      } else {
        holder[d[`${key1}`]] = d[`${key2}`];
      }
    });

    let obj2 = [];

    for (let prop in holder) {
      if (holder.hasOwnProperty(prop)) {
        obj2.push({ [key1]: prop, [key2]: holder[prop] });
      }
    }

    return obj2;
  }

  public async sortThree() {
    let random: any[] = [];
    let games: any[] = [];

    const allGames = await this.db
      .collection("games")
      .where("active", "==", true)
      .get();

    allGames.forEach((doc) => {
      const data = {
        id: doc.id,
        ...doc.data(),
      };
      games.push(data);
    });

    for (let i = 0; i < 3; i++) {
      random.push(games[Math.floor(Math.random() * games.length)]);
    }

    random.forEach((game) => {
      this.db
        .collection("games")
        .doc(game.id)
        .update({
          sorted: firestore.FieldValue.increment(1),
        });
    });

    this.createMsgToPin(bot, random);
  }

  private createMsgToPin(bot: any, games: any[]) {
    const question =
      "Estes foram os jogos sorteados para a Maratona Retrô (Semanal)";
    const caption = `${question}:\n\n
    1️⃣ - [${games[0].title}](${games[0].file_url}) (${games[0].genre})\n
    2️⃣ - [${games[1].title}](${games[1].file_url}) (${games[1].genre})\n
    3️⃣ - [${games[2].title}](${games[2].file_url}) (${games[2].genre})`;

    bot.telegram
      .sendMediaGroup(config.bot.chat, [
        {
          media: games[0].image_url,
          caption,
          parse_mode: "Markdown",
          disable_web_page_preview: "true",
          type: "photo",
        },
        {
          media: games[1].image_url,
          type: "photo",
        },
        {
          media: games[2].image_url,
          type: "photo",
        },
      ])
      .then((msg: any) => {
        bot.telegram.pinChatMessage(config.bot.chat, msg[0].message_id);
      });
  }

  // Database
  public async create(game: Game) {
    const { id } = await this.db.collection("games").add({
      ...game,
      sorted: 0,
      active: true,
    });

    return id;
  }

  public async listAll(): Promise<Array<Game>> {
    let games: any[] = [];

    const snapshot = await this.db.collection("games").get();

    snapshot.forEach((game) => {
      games.push(game.data());
    });

    return games;
  }

  //external api
  public async api(inline: any) {
    let access_token;
    const api = axios.create({
      baseURL: config.api.base_url,
    });

    let isCached: any = await this.cache.get("access_token");

    if (!isCached) {
      const { data } = await api.post(config.api.twitch_uri);
      access_token = data.access_token;
      this.cache.set("access_token", access_token);
    } else {
      access_token = isCached;
    }

    const { data } = await api.post(
      "/games",
      `fields name,url,id, summary; fields cover.image_id; search "${inline.query}";`,
      {
        headers: {
          "Client-ID": config.api.client_id,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const result: Array<InlineQueryResultArticle> = data.map((item: any) => {
      return {
        type: "article",
        input_message_content: { message_text: `${item.name}\n${item.url}` },
        id: item.id,
        title: item.name,
        description: item.summary ?? "",
        url: item.url,
        thumb_url:
          `https://images.igdb.com/igdb/image/upload/t_thumb/${item?.cover?.image_id}.jpg` ??
          "",
      };
    });

    return bot.telegram.answerInlineQuery(inline.id, result);
  }
}
