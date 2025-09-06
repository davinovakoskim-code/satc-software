import { Module } from '@nestjs/common'
import { AppController } from './controller/app.controller'
import { AppService } from './service/app.service'
import { ProductService } from './service/ProductService'
import { ProductResolver } from './app.resolver'
import { CartController } from './controller/cart.controller'
import { CartService } from './service/CartService'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { join } from 'path'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
  ],
  controllers: [AppController, CartController],
  providers: [AppService, ProductService, ProductResolver, CartService],
})
export class AppModule {}
