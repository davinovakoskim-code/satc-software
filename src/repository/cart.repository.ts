import { Injectable } from '@nestjs/common'
import { CartItem } from '../model/CartItem'

@Injectable()
export class CartRepository {
  private readonly items = new Map<string, CartItem>()

  findByProductId(productId: string): CartItem | undefined {
    return this.items.get(productId)
  }

  upsert(item: CartItem): CartItem {
    this.items.set(item.productId, item)
    return item
  }

  remove(productId: string): boolean {
    return this.items.delete(productId)
  }

  list(): CartItem[] {
    return Array.from(this.items.values())
  }

  clear(): void {
    this.items.clear()
  }

  countDistinctItems(): number {
    return this.items.size
  }

  countTotalQuantity(): number {
    return this.list().reduce((total, item) => total + item.quantity, 0)
  }
}
