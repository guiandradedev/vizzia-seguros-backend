import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { PartialUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
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
import { UpdateAddressDto } from 'src/address/dto/update-address.dto';
import { UpdateTelephoneDto } from 'src/telephone/dto/update-telephone.dto';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { ConductorService } from 'src/conductors/conductor/conductor.service';
import { CreateConductorDto } from 'src/conductors/conductor/dto/create-conductor.dto';
import { Conductor } from 'src/conductors/conductor/entities/conductor.entity';
import { UpdateInsuranceDto } from 'src/insurance/dto/update-insurance.dto';
import { Status } from 'src/insurance/enum/status.enum';

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
    
    private readonly conductorsService: ConductorService

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

    const { passwordHash, ...userWithoutPassword } = savedUser;

    return {
      userWithoutPassword,
      tokens
    }
  }

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

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserEntityById(id);

    const partialUpdateUserDto: PartialUpdateUserDto = updateUserDto;
    const updateAddressDto: UpdateAddressDto = updateUserDto;
    const updatetelephoneDto: UpdateTelephoneDto = updateUserDto;

    user.name = updateUserDto?.name ?? user.name;
    user.email = updateUserDto?.email ?? user.email;
    user.birthDate = updateUserDto?.birthDate ?? user.birthDate;
    user.marital_status = updateUserDto?.marital_status ?? user.marital_status;

    if (updateUserDto.passwordHash) {
      user.passwordHash = await this.hashingService.hash(updateUserDto.passwordHash);
    }

    const savedUser: User = await this.userRepository.save(user);
    await this.userTelephoneService.findUserTelephone(id);
    await this.userTelephoneService.updateUserTelephone(id, updatetelephoneDto);

    await this.userAddressService.findUserAddress(id);
    const savedAddress = await this.userAddressService.updateUserAddress(id, updateAddressDto);


    if (partialUpdateUserDto.marital_status || updateAddressDto) {
      // chamar todos os boobie goods

      console.log("boobie goods")

      // calcular o preco de todos os veiculos que tiver associado
      // todos os veiculos associados ao user
      const insuraces = await this.insuranceService.findAll_entities_by_user(savedUser.id);

      let updated_insurances: Insurance[] = [];

      for (const insurance of insuraces) {
        const {vehicle} = insurance;

        let price = 0;

        // * preco para o veiculo
        price += this.insuranceService.calculate_cost_for_vehicle(
          vehicle.motorization,
          vehicle.brand,
          vehicle.transmission,
          vehicle.year,
          vehicle.fipe,
          Number(vehicle.odometer)
        );

        // * preco para o user
        price += await this.insuranceService.calculate_cost_for_user(
          savedUser.gender,
          savedUser.marital_status,
          vehicle.park_type,
          vehicle.use_type,
          savedUser.cnhIssueDate,
          savedUser.age,
          savedAddress.cep,
          vehicle.model
        );

        // todos os condutores de um insurance 
        const conductors: Conductor[] = await this.conductorsService.findAll_entities_by_vehicle(insurance.vehicle.id);
        
        conductors.forEach(cond => {
          price += this.insuranceService.calculate_conductors_price(cond.gender, cond.marital_status, cond.cnhIssueDate, cond.age);
        });

        // preco do veiculo
        price += this.insuranceService.calculate_cost_for_vehicle(vehicle.motorization, vehicle.brand, vehicle.transmission, vehicle.year, vehicle.fipe, +vehicle.odometer);

        insurance.estimated_price = price;

        insurance.status = Status.Pending;
       
        updated_insurances.push(await this.insuranceService.update_entity(insurance));

      }         

      return updated_insurances;
    }
    return {
      message: "boobie goods"
    }
  }

  async remove(id: number) {
    const user = await this.findUserEntityById(id);
    await this.userRepository.remove(user);
    return { message: 'User removed successfully' };
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

