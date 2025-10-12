import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { HashingServiceProtocol } from 'src/auth/auth_jwt/hashing/hashing.service';
import { async } from 'rxjs';
import { Address } from 'src/address/entities/address.entity';
import { Telephone } from 'src/telephone/entities/telephone.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingServiceProtocol,
    private readonly dataSource: DataSource,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashingService.hash(createUserDto.passwordHash);

    return this.dataSource.transaction(async (manager) => {
      const userPayload = {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: hashedPassword,
        cnhNumber: createUserDto.cnhNumber,
        birthDate: createUserDto.birthDate,
        status: createUserDto.status,
        cnhIssueDate: createUserDto.cnhIssueDate,
        cpf: createUserDto.cpf,
      };
      const userEntity = manager.create(User, userPayload);
      const savedUser = await manager.save(userEntity);

      
      const addressPayload = {
        street: createUserDto.street,
        neighborhood: createUserDto.neighborhood,
        city: createUserDto.city,
        addressNumber: createUserDto.addressNumber,
        state: createUserDto.state,
        cep: createUserDto.cep,
        user: savedUser, // Vincula o endereço ao usuário recém-criado
      };
      console.log(addressPayload)
      const addressEntity = manager.create(Address, addressPayload);
      await manager.save(addressEntity);
      
      
      const telephonePayload = {
        number: createUserDto.phone_number,
        type: createUserDto.type,
        user: savedUser, // Vincula o telefone ao usuário
      };
      const telephoneEntity = manager.create(Telephone, telephonePayload);
      await manager.save(telephoneEntity);

      const { passwordHash, ...result } = savedUser;
      return result;
    });
  }


  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  private async findUserEntityById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (user) return user;

    throw new NotFoundException('User not found');
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async me(id: number) {
    const user = await this.findOne(id);
    const vehicles = [];

    return {
      ...user,
      vehicles,
    };
  }
}

