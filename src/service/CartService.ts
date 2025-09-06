import { Injectable, NotFoundException } from '@nestjs/common'
import { CartItem } from '../model/CartItem'
import { ProductService } from './ProductService'

@Injectable()
export class CartService {
  private readonly items: Map<string, CartItem> = new Map()

  constructor(private readonly productService: ProductService) {}

  addItem(productId: string, quantity: number): CartItem {
    this.productService.findProductById(productId)
    const existing = this.items.get(productId)
    const newQuantity = (existing?.quantity ?? 0) + quantity
    const item: CartItem = { productId, quantity: newQuantity }
    this.items.set(productId, item)
    return item
  }

  updateItem(productId: string, quantity: number): CartItem {
    const existing = this.items.get(productId)
    if (!existing) {
      throw new NotFoundException('Item não encontrado no carrinho')
    }
    const item: CartItem = { productId, quantity }
    this.items.set(productId, item)
    return item
  }

  removeItem(productId: string): void {
    const existed = this.items.delete(productId)
    if (!existed) {
      throw new NotFoundException('Item não encontrado no carrinho')
    }
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values())
  }
}
