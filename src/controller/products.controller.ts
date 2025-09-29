import { Controller, Get, Param, Query } from '@nestjs/common'
import { Product } from '../model/Product'
import { ProductListResponse } from '../model/ProductListResponse'
import { ProductService } from '../service/ProductService'
import { ProductListItem } from '../model/ProductListItem'

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(@Query('page') page?: string, @Query('limit') limit?: string): ProductListResponse<ProductListItem> {
    const parsedPage = page ? Number.parseInt(page, 10) : undefined
    const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined
    const pageNumber = Number.isNaN(parsedPage) ? undefined : parsedPage
    const limitNumber = Number.isNaN(parsedLimit) ? undefined : parsedLimit
    return this.productService.getProducts(pageNumber, limitNumber)
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.productService.findProductById(id)
  }
}
