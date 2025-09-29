export interface ProductListResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}
