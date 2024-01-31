import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignUpInput } from './dto/signup-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SignResponse } from './dto/sign-response';
import { SignInInput } from './dto/signin-input';
import { LogoutResponse } from './dto/logout-response';
import { Public } from './decorators/public.decorator';
import { NewTokensResponse } from './dto/newTokensResponse';
import { CurrentCustomerId } from './decorators/currentCustomerId.decorator';
import { CurrentCustomer } from './decorators/currentCustomer.decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { GetCustomerResponse } from './dto/get-response';
import { DeleteCustomerResponse } from './dto/delete-response';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignResponse)
  signup(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signup(signUpInput);
  }

  @Public()
  @Mutation(() => SignResponse)
  signin(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signin(signInInput);
  }

  @Mutation(() => LogoutResponse)
  logout(@Args('id') id: string) {
    return this.authService.logout(id);
  }

  @Query(() => String)
  hello() {
    return 'hello';
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokensResponse)
  getNewTokens(
    @CurrentCustomerId() customerId: string,
    @CurrentCustomer('refreshToken') refreshToken: string,
  ) {
    return this.authService.getNewTokens(customerId, refreshToken);
  }

  @Query(() => GetCustomerResponse, { name: 'getCustomer' })
  getCustomer(@Args('id') id: string) {
    return this.authService.getCustomer(id);
  }

  @Mutation(() => GetCustomerResponse, { name: 'updateCustomer' })
  updateCustomer(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => DeleteCustomerResponse, { name: 'deleteCustomer' })
  deleteCustomer(@Args('id') id: string) {
    return this.authService.remove(id);
  }
}
