import { Injectable, NotFoundException } from '@nestjs/common'
import { Product } from '../model/Product'
import { ProductGql } from '../model/ProductGql'
import { ProductListResponse } from '../model/ProductListResponse'
import { ProductRepository } from '../repository/product.repository'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

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

  findProductById(id: string): Product {
    const product = this.productRepository.findById(id)

    if (!product) {
      throw new NotFoundException('Produto não encontrado')
    }

    return product
  }

  findProductGqlById(id: string): ProductGql {
    return this.findProductById(id) as ProductGql
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
