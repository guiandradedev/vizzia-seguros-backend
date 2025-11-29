import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingServiceProtocol } from 'src/auth/auth_jwt/hashing/hashing.service';
import { UserTelephoneService } from 'src/user/user_telephone/user_telephone.service';
import { UserAddressService } from 'src/user/user_address/user_address.service';
import { CreateUserAddressDto } from 'src/user/user_address/dto/create-user_address.dto';
import { CreateUserTelephoneDto } from 'src/user/user_telephone/dto/create-user_telephone.dto';
import 'multer';
import { AuthService } from 'src/auth/auth_jwt/auth.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { InsuranceService } from 'src/insurance/insurance.service';
import { Insurance } from 'src/insurance/entities/insurance.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingServiceProtocol,

    private readonly userTelephoneService: UserTelephoneService,
    private readonly userAddressService: UserAddressService,
    private readonly insuranceService: InsuranceService,

    @Inject(forwardRef(() => VehicleService))
    private readonly vehicleService: VehicleService,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

  ) { }

  async create(createUserDto: CreateUserDto) {
    const userPayload: UserDto = createUserDto;

    userPayload.passwordHash = await this.hashingService.hash(userPayload.passwordHash);

    const savedUser = this.userRepository.create(userPayload);
    await this.userRepository.save(savedUser);

    const addressPayload = {
      street: createUserDto.street,
      neighborhood: createUserDto.neighborhood,
      city: createUserDto.city,
      addressNumber: createUserDto.addressNumber,
      state: createUserDto.state,
      cep: createUserDto.cep,
      user: savedUser, // Vincula o endereço ao usuário recém-criado
    };

    const userAddress: CreateUserAddressDto = {
      userId: savedUser,
      address: addressPayload,
    }

    await this.userAddressService.create(userAddress);

    const telephonePayload = {
      phone_number: createUserDto.phone_number,
      type: createUserDto.type,
    };

    const userTelephone: CreateUserTelephoneDto = {
      userId: savedUser,
      telephone: telephonePayload
    };


    await this.userTelephoneService.create(userTelephone);

    const tokens = await this.authService.generateToken(savedUser.id, savedUser.role);

    const {passwordHash, ...userWithoutPassword} = savedUser;

    return {
      userWithoutPassword,
      tokens
    }
  }


  // await this.userTelephoneService.create()

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async findUserEntityById(id: number): Promise<User> {
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
    let vehicles: any[];
    let insurances: Insurance[] = [];

    try {
      vehicles = await this.vehicleService.findAllVehiclesByUser(id);
      insurances = await this.insuranceService.findAll_by_user(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        vehicles = [];
      } else {
        throw new NotFoundException(`Failed to retrieve vehicles for user ${id}: ${error.message}`);
      }
    }


    return {
      ...user,
      vehicles,
      insurances
    };
  }
}

