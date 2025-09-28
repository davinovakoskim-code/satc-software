import { Injectable } from '@nestjs/common'
import { Product } from '../model/Product'
import { products as productSeed } from '../data/Products'

interface PaginatedResult<T> {
  items: T[]
  totalItems: number
}

@Injectable()
export class ProductRepository {
  private readonly products: Product[] = productSeed

  findAll(page: number, limit: number): PaginatedResult<Product> {
    const totalItems = this.products.length
    const start = (page - 1) * limit
    const end = start + limit
    const items = this.products.slice(start, end)
    return { items, totalItems }
  }

  findById(id: string): Product | undefined {
    return this.products.find(product => product.id === id)
  }
}
