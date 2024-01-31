import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteCustomerResponse {
  @Field()
  id: string;
}
