import axios from 'axios';
import { Context } from 'telegraf';
// eslint-disable-next-line import/no-unresolved
import { InlineQuery, InlineQueryResultArticle, Update } from 'telegraf/typings/core/types/typegram';

import Cache from '../config/caching';

export default class IgdbService {
  private cache = new Cache();

  constructor(private ctx: Context<Update>) {
    this.ctx = ctx;
  }

  async run(inline: InlineQuery) {
    let accessToken: string;
    const api = axios.create({
      baseURL: process.env.IGDB_BASE_URL,
    });

    const isCached = await this.cache.get('access_token') as string;

    if (!isCached) {
      const { data } = await api.post(process.env.TWITCH_URI || '');
      accessToken = data.access_token;
      this.cache.set('access_token', accessToken);
    } else {
      accessToken = isCached;
    }
    const { data } = await api.post(
      '/games',
      `fields name,url,id, summary; fields cover.image_id; search "${inline.query}";`,
      {
        headers: {
          'Client-ID': process.env.IGDB_CLIENT_ID || '',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const result: Array<InlineQueryResultArticle> = data.map((item: any) => ({
      type: 'article',
      input_message_content: { message_text: `${item.name}\n${item.url}` },
      id: item.id,
      title: item.name,
      description: item.summary ?? '',
      url: item.url,
      thumb_url:
          `https://images.igdb.com/igdb/image/upload/t_thumb/${item?.cover?.image_id}.jpg`
          ?? '',
    }));

    await this.ctx.answerInlineQuery(result);
  }
}
