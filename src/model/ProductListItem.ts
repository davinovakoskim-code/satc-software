import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ProductListItem {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  price: number
  
  
}