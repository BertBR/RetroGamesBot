import NodeCache from 'node-cache';

export class Cache {
    private myCache = new NodeCache({stdTTL: 3600});

    set(key: string, value: any[]) {
      const success = this.myCache.set(key, value);
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

    list(){
      return this.myCache.keys()
    }
}
