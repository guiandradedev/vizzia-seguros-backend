import { forwardRef, Module } from '@nestjs/common';
import { TelephoneService } from './telephone.service';
import { TelephoneController } from './telephone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Telephone } from './entities/telephone.entity';
import { UsersModule } from 'src/user/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Telephone]),
    forwardRef(() => UsersModule),
  ],
  controllers: [TelephoneController],
  providers: [TelephoneService],
  exports: [TelephoneService],
})
export class TelephoneModule {}
