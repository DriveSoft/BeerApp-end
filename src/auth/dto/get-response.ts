import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType()
export class GetCustomerResponse {
  @Field()
  id: string;
  @Field()
  email: string;
  @Field()
  role: Role;
}
