import { Injectable } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from './entities/user_address.entity';
import { Repository } from 'typeorm';
import { AddressService } from 'src/address/address.service'
import { UpdateAddressDto } from 'src/address/dto/update-address.dto'
import { UsersService } from 'src/users/users.service';


@Injectable()
export class UserAddressService {
  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
    private readonly addressService: AddressService,
    private readonly usersService: UsersService,
  ){}

  async create(createUserAddressDto: CreateUserAddressDto) {
    const address = await this.addressService.create(createUserAddressDto.address);
    
    const userAddress = this.userAddressRepository.create({
      user: createUserAddressDto.userId,
      address: address
    });

    await this.userAddressRepository.insert(userAddress);

    return userAddress;
  }

  findAll() {
    return `This action returns all userAddress`;
  }

  async findUserAddress(idUser: number)
  {
    const userAddress = await this.userAddressRepository.findOne({
      where: { user: { id: idUser } },
      relations: ['address'],
    });

    // Se existir, retorna apenas o endereço
    return userAddress!.address;
  }

  async updateUserAddress(userId: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.findUserAddress(userId);

    const updatedAddress = await this.addressService.update(address.id, updateAddressDto);
    
    return updatedAddress;
  }

  async removeUserAddress(userId: number) {
    const address = await this.findUserAddress(userId);
    await this.addressService.remove(address.id);
    return address;
  }
}
