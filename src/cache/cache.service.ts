import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService {
  
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    
    await this.cacheManager.set(key, value, ttl * 1000) // O NestJS usa milissegundos
  }

  
  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key)
  }

  
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key)
  }
}
