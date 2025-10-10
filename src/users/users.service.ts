import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingServiceProtocol } from 'src/auth/auth_jwt/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingServiceProtocol,
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    const passwordHash = this.hashingService.hash(createUserDto.passwordHash);
    
    const userdata= {
      ...createUserDto,
      passwordHash: await passwordHash
    };

    const user = this.userRepository.create(userdata);
    await this.userRepository.save(user);
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({id});

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({email});

    if (user) return user;

    throw new NotFoundException('User not found');
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async me(id: number){
    return await this.findOne(id);
  }
}
