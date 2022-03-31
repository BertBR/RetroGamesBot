import { Pool } from 'pg';

export default class Database {
  private pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    ssl: { rejectUnauthorized: process.env.POSTGRES_HOST !== 'localhost' },
  });

  async getTotalGames() {
    return this.pool.query('SELECT count(*) AS "count" FROM "public"."games"');
  }

  async getTotalGamesCountByConsole() {
    return this.pool.query('SELECT "public"."games"."console" AS "console", count(*) AS "count" FROM "public"."games" GROUP BY "public"."games"."console" ORDER BY "count" DESC, "public"."games"."console" ASC');
  }

  async getTotalSortedBy(col: string) {
    return this.pool.query(`SELECT "public"."games"."${col}" AS "${col}", sum("public"."games"."sorted") AS "sum"
    FROM "public"."games"
    GROUP BY "public"."games"."${col}"
    ORDER BY "sum" DESC, "public"."games"."${col}" ASC
    LIMIT 10`);
  }

  async getTotalSortedGames() {
    return this.pool.query(`SELECT "public"."games"."title" AS "title", "public"."games"."file_url" AS "file_url", "public"."games"."image_url" AS "image_url", sum("public"."games"."sorted") AS "sum"
    FROM "public"."games"
    GROUP BY "public"."games"."title", "public"."games"."file_url", "public"."games"."image_url"
    ORDER BY "sum" DESC, "public"."games"."title" ASC, "public"."games"."file_url" ASC, "public"."games"."image_url" ASC
    LIMIT 10`);
  }

  async getThreeRandomGames() {
    return this.pool.query(`SELECT * FROM games
    ORDER BY random() LIMIT 5;`);
  }

  async incrementSortedGames(ids: Array<number>) {
    // eslint-disable-next-line no-restricted-syntax
    for (const id of ids) {
      // eslint-disable-next-line no-await-in-loop
      await this.pool.query(`UPDATE games 
      SET sorted = sorted + 1
   WHERE id = ${id};`);
    }
  }
}
