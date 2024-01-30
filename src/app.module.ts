import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // buildSchemaOptions: {
      //   dateScalarMode: 'timestamp',
      // },
      //context: ({ request, reply }) => ({ request, reply }),
      //playground: true,
      //introspection: true, // TODO update this so that it's off in production;
    }),
    AuthModule,
    CustomerModule,
  ],
  controllers: [], //AppController
  providers: [
    //AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}
