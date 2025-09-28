import { Body, Controller, Get, Post } from '@nestjs/common'
import { CartItem } from '../model/CartItem'
import { CartSummary } from '../model/CartSummary'
import { CartService } from '../service/CartService'

class AddToCartDto {
  productId: string
  quantity: number
}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addItem(@Body() dto: AddToCartDto): Promise<CartItem> {
    return this.cartService.addItem(dto.productId, dto.quantity)
  }

  @Get()
  getCartSummary(): CartSummary {
    return this.cartService.getSummary()
  }
}
