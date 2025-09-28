import { Injectable, NotFoundException } from '@nestjs/common'
import { Product } from '../model/Product'
import { ProductGql } from '../model/ProductGql'
import { ProductListResponse } from '../model/ProductListResponse'
import { ProductRepository } from '../repository/product.repository'
import { CacheService } from '../cache/cache.service' 
import { ProductListItem } from '../model/ProductListItem' 

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cacheService: CacheService,
  ) {}

 
  getProducts(page?: number, limit?: number): ProductListResponse<ProductListItem> { // 👈 Tipagem corrigida
    const safeLimit = this.normalizeLimit(limit)
    const safePage = this.normalizePage(page)
    
   
    const { items, totalItems } = this.productRepository.findAllOptimized(safePage, safeLimit) 
    
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

    await this.cacheService.set(cacheKey, product, 3600)
    return product
  }

  async findProductGqlById(id: string): Promise<ProductGql> {
    return (await this.findProductById(id)) as ProductGql
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


