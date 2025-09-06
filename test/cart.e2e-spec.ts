import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from './../src/app.module'

describe('CartController (e2e)', () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /cart/items', () => {
    return request(app.getHttpServer())
      .post('/cart/items')
      .send({ productId: '1', quantity: 2 })
      .expect(201)
      .expect({ productId: '1', quantity: 2 })
  })

  it('PATCH /cart/items/:productId', () => {
    return request(app.getHttpServer())
      .patch('/cart/items/1')
      .send({ quantity: 5 })
      .expect(200)
      .expect({ productId: '1', quantity: 5 })
  })

  it('DELETE /cart/items/:productId', () => {
    return request(app.getHttpServer()).delete('/cart/items/1').expect(204)
  })
})
