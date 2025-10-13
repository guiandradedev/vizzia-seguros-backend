import { Injectable } from '@nestjs/common';
import { CreateUserTelephoneDto } from './dto/create-user_telephone.dto';
import { UpdateUserTelephoneDto } from './dto/update-user_telephone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TelephoneService } from 'src/telephone/telephone.service';
import { Repository } from 'typeorm';
import { UserTelephone } from './entities/user_telephone.entity';
import { UpdateTelephoneDto } from 'src/telephone/dto/update-telephone.dto';

@Injectable()
export class UserTelephoneService {
  constructor(
    @InjectRepository(UserTelephone)
    private readonly userTelephoneRepository: Repository<UserTelephone>,
    private readonly telephoneService: TelephoneService,
  ) {}

  async create(createUserTelephoneDto: CreateUserTelephoneDto) {
    

    const telephone = await this.telephoneService.create(createUserTelephoneDto.telephone);

  

    const userTelephone = this.userTelephoneRepository.create({
      userId: createUserTelephoneDto.userId,
      telephoneId: telephone,
    });

    await this.userTelephoneRepository.save(userTelephone);

    return userTelephone;
  }

  async findUserTelephone(idUser: number) {
    const userTelephone = await this.userTelephoneRepository.findOne({
      where: { userId: { id: idUser } },
      relations: ['telephoneId'],
    });

    // Retorna apenas o telefone, se existir
    return userTelephone?.telephoneId;
  }

  async updateUserTelephone(userId: number, updateTelephoneDto: UpdateTelephoneDto) {
    const telephone = await this.findUserTelephone(userId);

    if (!telephone) {
      throw new Error('Nenhum telefone encontrado para este usuário.');
    }

    const updatedTelephone = await this.telephoneService.update(telephone.id, updateTelephoneDto);
    
    return updatedTelephone;
  }

  async removeUserTelephone(userId: number) {
    const telephone = await this.findUserTelephone(userId);

    if (!telephone) {
      throw new Error('Nenhum telefone encontrado para este usuário.');
    }
    
    // A remoção em cascata (onDelete: 'CASCADE') cuidará da entidade UserTelephone
    await this.telephoneService.remove(telephone.id);
    
    return telephone;
  }
}
