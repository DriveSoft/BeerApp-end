import { Field, ObjectType } from '@nestjs/graphql';
import { Customer } from 'src/lib/entities/customer.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class SignResponse {
  @IsNotEmpty()
  @IsString()
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => Customer)
  customer: Customer;
}
