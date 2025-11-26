import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity'



@Injectable()
export class AddressService {
  constructor (
    @InjectRepository(Address)
      private readonly addressRepository: Repository <Address>
  ){}


  async create(createAddressDto: CreateAddressDto) {
    const address: CreateAddressDto = {
      ...createAddressDto
    }

    const addressEntity = await this.addressRepository.create(address);

    await this.addressRepository.insert(addressEntity);

    return addressEntity;
  }

  findAll() {
    return this.addressRepository.find();
  }

  async findOne(id: number) {
    const address = await this.addressRepository.findOneBy({id});
    if(!address)
      throw new NotFoundException('Address not found');

    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOne(id);
    
    address.street = updateAddressDto.street ?? address.street;
    address.neighborhood = updateAddressDto.neighborhood ?? address.neighborhood;
    address.city = updateAddressDto.city ?? address.city;
    address.state = updateAddressDto.state ?? address.state;
    address.addressNumber = updateAddressDto.addressNumber ?? address.addressNumber;
    address.cep = updateAddressDto.cep ?? address.cep;

    await this.addressRepository.update(address.id, address);

    return address;
  }

  async remove(id: number) {
    const address = await this.addressRepository.findOneBy({ id });
    if(!address)
      throw new NotFoundException('Address not found');
    
    await this.addressRepository.remove(address);
  }
}
