import { Module } from '@nestjs/common'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
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
  ],
  controllers: [AppController, ProductsController, CartController],
  providers: [AppService, ProductService, ProductResolver, CartService, ProductRepository, CartRepository],
})
export class AppModule {}
