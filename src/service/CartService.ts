import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CartItem } from '../model/CartItem'
import { CartSummary } from '../model/CartSummary'
import { CartRepository } from '../repository/cart.repository'
import { ProductService } from './ProductService'

const ARTIFICIAL_DELAY_MS = 750

@Injectable()
export class CartService {
  constructor(
    private readonly productService: ProductService,
    private readonly cartRepository: CartRepository,
  ) {}

  async addItem(productId: string, quantity: number): Promise<CartItem> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser um número inteiro positivo')
    }

    this.productService.findProductById(productId)
    await this.simulateProcessingDelay()

    const existing = this.cartRepository.findByProductId(productId)
    const newQuantity = (existing?.quantity ?? 0) + quantity
    const item: CartItem = { productId, quantity: newQuantity }

    return this.cartRepository.upsert(item)
  }

  updateItem(productId: string, quantity: number): CartItem {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser um número inteiro positivo')
    }

    const existing = this.cartRepository.findByProductId(productId)
    if (!existing) {
      throw new NotFoundException('Item não encontrado no carrinho')
    }

    const item: CartItem = { productId, quantity }
    return this.cartRepository.upsert(item)
  }

  removeItem(productId: string): void {
    const removed = this.cartRepository.remove(productId)
    if (!removed) {
      throw new NotFoundException('Item não encontrado no carrinho')
    }
  }

  getSummary(): CartSummary {
    const items = this.cartRepository.list()
    return {
      items,
      totalQuantity: this.cartRepository.countTotalQuantity(),
      totalItems: this.cartRepository.countDistinctItems(),
    }
  }

  private simulateProcessingDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY_MS))
  }
}
