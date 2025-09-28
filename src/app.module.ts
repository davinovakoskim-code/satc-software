import { Module } from '@nestjs/common'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
// --- Imports para Cache ---
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store'
import { CacheService } from './cache/cache.service'
import { AppController } from './controller/app.controller'
import { CartController } from './controller/cart.controller'
import { ProductsController } from './controller/products.controller'
import { ProductResolver } from './app.resolver'
import { CartRepository } from './repository/cart.repository'
import { ProductRepository } from './repository/product.repository'
import { AppService } from './service/app.service'
import { CartService } from './service/CartService'
import { ProductService } from './service/ProductService'

@Module({
  imports: [
    
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),

    
    CacheModule.register({
      isGlobal: true, 
      store: async () =>
        (await redisStore({
          socket: {
            host: 'localhost', 
            port: 6379,
          },
        })) as any,
    }),
  ],
  controllers: [AppController, ProductsController, CartController],
  providers: [
    AppService,
    ProductService,
    ProductResolver,
    CartService,
    ProductRepository,
    CartRepository,
    CacheService, 
  ],
  exports: [
    CacheService, 
  ],
})
export class AppModule {}
