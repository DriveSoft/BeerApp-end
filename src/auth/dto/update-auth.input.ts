import { Role } from '@prisma/client';
import { SignUpInput } from './signup-input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAuthInput extends PartialType(SignUpInput) {
  @Field()
  id: string;
  @Field()
  email: string;
  @Field()
  role: Role;
}
