import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth_jwt/auth.module';
import { UsersModule } from 'src/user/users/users.module';
import { FaqModule } from 'src/faq/faq.module';
import { SocialAuthModule } from 'src/auth/social_auth/social_auth.module';
import { Telephone } from 'src/telephone/entities/telephone.entity';
import { TelephoneModule } from 'src/telephone/telephone.module';
import { UserTelephoneModule } from 'src/user/user_telephone/user_telephone.module';
import { UserAddressModule } from 'src/user/user_address/user_address.module';
import { AddressModule } from 'src/address/address.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT') || '5432', 10),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Caminho corrigido para as entidades
        synchronize: true, // Em desenvolvimento, pode ser true. Em produção, use migrações.
        autoLoadEntities: true,
        // dropSchema: true,
      })
    }),
    AuthModule,
    UsersModule,
    UserAddressModule,
    FaqModule,
    SocialAuthModule,
    TelephoneModule,
    UserTelephoneModule,
    AddressModule,
    VehicleModule,
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}