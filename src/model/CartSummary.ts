import { CartItem } from './CartItem'

export interface CartSummary {
  items: CartItem[]
  totalQuantity: number
  totalItems: number
}
