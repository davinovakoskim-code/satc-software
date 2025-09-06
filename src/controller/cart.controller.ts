import { Body, Controller, Delete, HttpCode, Param, Patch, Post } from '@nestjs/common'
import { CartService } from '../service/CartService'
import { CartItem } from '../model/CartItem'

class AddItemDto {
  productId: string
  quantity: number
}

class UpdateItemDto {
  quantity: number
}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  addItem(@Body() dto: AddItemDto): CartItem {
    return this.cartService.addItem(dto.productId, dto.quantity)
  }

  @Patch('items/:productId')
  updateItem(@Param('productId') productId: string, @Body() dto: UpdateItemDto): CartItem {
    return this.cartService.updateItem(productId, dto.quantity)
  }

  @Delete('items/:productId')
  @HttpCode(204)
  removeItem(@Param('productId') productId: string): void {
    this.cartService.removeItem(productId)
  }
}
