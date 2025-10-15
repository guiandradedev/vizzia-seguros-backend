import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CnhImageController } from './cnh-image.controller';
import { CnhImage } from './entities/cnh-image.entity';
import { CnhImageService } from './cnh-image.service'; // Importe o serviço

@Module({
  imports: [
    TypeOrmModule.forFeature([CnhImage]),
  ],
  controllers: [CnhImageController],
  // Registre o serviço aqui
  providers: [CnhImageService],
})
export class CnhImageModule {}