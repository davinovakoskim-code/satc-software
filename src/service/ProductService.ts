import { Injectable, NotFoundException } from '@nestjs/common'
import { Product } from '../model/Product'
import { ProductGql } from '../model/ProductGql'
import { ProductListResponse } from '../model/ProductListResponse'
import { ProductRepository } from '../repository/product.repository'
import { CacheService } from 'src/cache/cache.service'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cacheService: CacheService, //Injetar CacheService
  ) {}

  getProducts(page?: number, limit?: number): ProductListResponse {
    const safeLimit = this.normalizeLimit(limit)
    const safePage = this.normalizePage(page)
    const { items, totalItems } = this.productRepository.findAll(safePage, safeLimit)
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit))

    return {
      data: items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalItems,
        totalPages,
      },
    }
  }

  async findProductById(id: string): Promise<Product> { 
    const cacheKey = `product:${id}`
    const TTL_SECONDS = 3600 

    
    const cachedProduct = await this.cacheService.get<Product>(cacheKey)
    if (cachedProduct) {
      console.log(`[Cache-Hit] Produto ${id} encontrado no cache!`)
      return cachedProduct
    }

    
    console.log(`[Cache-Miss] Produto ${id} não encontrado. Buscando no DB...`)
    
    
    const product = this.productRepository.findById(id) 

    if (!product) {
      throw new NotFoundException('Produto não encontrado')
    }
    
    
    await this.cacheService.set(cacheKey, product, TTL_SECONDS) 

    return product
  }

  async findProductGqlById(id: string): Promise<ProductGql> { 
    //O findProductById agora lida com o cache
    const product = await this.findProductById(id) 
    return product as ProductGql
  }

  private normalizeLimit(limit?: number): number {
    if (!limit || Number.isNaN(limit)) {
      return DEFAULT_LIMIT
    }

    const floored = Math.floor(limit)
    return Math.max(1, Math.min(floored, MAX_LIMIT))
  }

  private normalizePage(page?: number): number {
    if (!page || Number.isNaN(page)) {
      return DEFAULT_PAGE
    }

    const floored = Math.floor(page)
    return Math.max(1, floored)
  }
}
