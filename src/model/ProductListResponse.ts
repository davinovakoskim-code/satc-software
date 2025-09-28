import { Product } from './Product'

export interface ProductListResponse {
  data: Product[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}
