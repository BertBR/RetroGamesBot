import axios from 'axios';
import { Context } from 'telegraf';
import { InlineQuery, InlineQueryResultArticle, Update } from 'telegraf/typings/core/types/typegram';
import {Cache} from '../config/caching';

export class IgdbService {
  private cache = new Cache();

  constructor(private ctx: Context<Update>){}

  async run(inline: InlineQuery) {
    let access_token: string;
    const api = axios.create({
      baseURL: process.env.IGDB_BASE_URL,
    });

    let isCached = await this.cache.get('access_token') as string;

    if (!isCached) {
      const { data } = await api.post(process.env.TWITCH_URI || '');
      access_token = data.access_token;
      this.cache.set('access_token', access_token);
    } else {
      access_token = isCached;
    }
    const { data } = await api.post(
      "/games",
      `fields name,url,id, summary; fields cover.image_id; search "${inline.query}";`,
      {
        headers: {
          "Client-ID": process.env.IGDB_CLIENT_ID || "",
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

    await this.ctx.answerInlineQuery(result)
  }
}