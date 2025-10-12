import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressService } from 'src/address/address.service'
import { UpdateAddressDto } from 'src/address/dto/update-address.dto'
import { UsersService } from 'src/users/users.service';
import { UserCnh } from './entities/user_cnh.entity';
import { CnhImageService } from 'src/cnh-image/cnh-image.service';
import { CreateUserCnhDto } from './dto/create-user_cnh.dto'


@Injectable()
export class UserCnhService {
  
  constructor(
    @InjectRepository(UserCnh)
    private readonly userCnhRepository: Repository<UserCnh>,
    private readonly cnhImageService: CnhImageService,
    private readonly usersService: UsersService,
  ){}

  async create(createUserCnhDto: CreateUserCnhDto, file: Express.Multer.File) {
    const user = await this.usersService.findOne(createUserCnhDto.userId);

    const cnhImage = await this.cnhImageService.uploadAndSaveCnh(file, user.id);
    
    const userCnh = await this.userCnhRepository.create({
      user: user,
      cnh: cnhImage
    });

    await this.userCnhRepository.insert(userCnh);

    return userCnh;
  }

  findAll() {
    return `This action returns all userAddress`;
  }

  async findUserCnh(idUser: number)
  {
    const userCnh = await this.userCnhRepository.findOne({
      where: { user: { id: idUser } },
      relations: ['cnh'],
    });

    // Se existir, retorna apenas o endereço
    return userCnh!.cnh;
  }

  /*async removeUserCnh(userId: number) {
    const cnh = await this.findUserCnh(userId);
    await this.cnhImageService.remove(cnh.id);
    return cnh;
  }*/
}
