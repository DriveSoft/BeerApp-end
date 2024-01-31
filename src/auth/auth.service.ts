import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpInput } from './dto/signup-input';
import { SignInInput } from './dto/signin-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { GetCustomerResponse } from './dto/get-response';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async signup(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const customer = await this.prisma.customer.create({
      data: {
        email: signUpInput.email,
        hashedPassword: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = await this.createTokens(
      customer.id,
      customer.email,
    );

    await this.updateRefreshToken(customer.id, refreshToken);

    return { accessToken, refreshToken, customer };
  }

  async signin(signInInput: SignInInput) {
    const customer = await this.prisma.customer.findUnique({
      where: { email: signInInput.email },
    });

    if (!customer) {
      throw new Error('Access Denied');
    }

    const isPasswordValid = await argon.verify(
      customer.hashedPassword,
      signInInput.password,
    );

    if (!isPasswordValid) {
      throw new Error('Access Denied');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      customer.id,
      customer.email,
    );

    await this.updateRefreshToken(customer.id, refreshToken);

    return { accessToken, refreshToken, customer };
  }

  async getCustomer(id: string): Promise<GetCustomerResponse> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: id },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    return { id: customer.id, email: customer.email, role: customer.role };
  }

  async update(
    currentCustomerId: string,
    customerId: string,
    updateAuthInput: UpdateAuthInput,
  ): Promise<GetCustomerResponse> {
    const currentCustomer = await this.prisma.customer.findUnique({
      where: { id: currentCustomerId },
    });

    if (!currentCustomer)
      throw new ForbiddenException('Current customer not found');

    if (currentCustomer.role !== 'ADMIN')
      throw new ForbiddenException('Access Denied');

    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        email: updateAuthInput.email,
        role: updateAuthInput.role,
      },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    return { id: customer.id, email: customer.email, role: customer.role };
  }

  async remove(currentCustomerId: string, customerId: string,) {
    const currentCustomer = await this.prisma.customer.findUnique({
      where: { id: currentCustomerId },
    });

    if (!currentCustomer)
      throw new ForbiddenException('Current customer not found');

    if (currentCustomer.role !== 'ADMIN')
      throw new ForbiddenException('Access Denied');

    const customer = await this.prisma.customer.deleteMany({
      where: { id: customerId },
    });

    if (customer.count === 0) throw new NotFoundException('Customer not found');

    return { id: customerId };
  }

  async createTokens(customerId: string, email: string) {
    const accessToken = this.jwtService.sign(
      {
        customerId,
        email,
      },
      {
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        customerId,
        email,
        accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(customerId: string, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.customer.update({
      where: { id: customerId },
      data: { hashedRefreshToken },
    });
  }

  async logout(customerId: string) {
    await this.prisma.customer.updateMany({
      where: {
        id: customerId,
        hashedRefreshToken: { not: null },
      },
      data: { hashedRefreshToken: null },
    });

    return { loggedOut: true };
  }

  async getNewTokens(customerId: string, rt: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new ForbiddenException('Access Denied');
    }

    const doRefreshTokenMatch = await argon.verify(
      customer.hashedRefreshToken,
      rt,
    );

    if (!doRefreshTokenMatch) {
      throw new ForbiddenException('Access Denied');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      customer.id,
      customer.email,
    );

    await this.updateRefreshToken(customer.id, refreshToken);
    return { accessToken, refreshToken, customer };
  }
}
