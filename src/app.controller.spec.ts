import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProductService } from './service/ProductService'

describe('AppController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, ProductService],
    }).compile()
  })

  describe('getHealth', () => {
    it('should return "API is online!"', () => {
      const appController = app.get(AppController)
      expect(appController.getHealth()).toBe('API is online!')
    })
  })
})
