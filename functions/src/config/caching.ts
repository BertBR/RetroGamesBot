import NodeCache from 'node-cache';

export class Cache {
    private myCache = new NodeCache({stdTTL: 86400});

    set(key: string, searches: any) {
      const success = this.myCache.set(key, searches);
      return success;
    }

    async get(key: string) {
      const value = await this.myCache.get(key);
      return value;
    }

    del(key: string){
      this.myCache.del(key);
      return true;
    }
}
