import NodeCache from "node-cache";

export class Cache {
  private myCache = new NodeCache();

  set(key: string, value: unknown) {
    const success = this.myCache.set(key, value);
    return success;
  }

  async get(key: string) {
    const value = await this.myCache.get(key);
    return value;
  }
}
