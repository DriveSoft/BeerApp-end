import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ActivationCode {
  @IsNotEmpty()
  @IsString()
  @Field()
  activationCode: string;
}
