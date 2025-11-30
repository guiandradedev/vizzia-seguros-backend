import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Insurance } from './entities/insurance.entity';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { EvaluateInsuranceDto } from './dto/evaluate_insurance.dto';
import { Status } from './enum/status.enum';
import { ConductorService } from 'src/conductors/conductor/conductor.service';
import { ConductorStatus } from 'src/conductors/conductor/entities/conductor.entity';
import { MotorizationType, MotorizationWeight } from 'src/vehicle/enums/motorization-types.enum';
import { Brands, BrandsWeight } from 'src/vehicle/enums/brand.enum';
import { TransmissionType, TransmissionWeight } from 'src/vehicle/enums/transmission-type.enum';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { GenderTypes, GenderWeight } from 'src/user/users/enums/gender-type.enum';
import { MaritalStatusType, MaritalStatusWeight } from 'src/user/users/enums/marital_status-Type.enum';
import { ParkType, ParkWeight } from 'src/address/enums/park_type.enum';
import { VehicleUseType, VehicleUseWeight } from 'src/vehicle/enums/vehicle_use-types.enum';
import { CreateConductorDto } from 'src/conductors/conductor/dto/create-conductor.dto';

@Injectable()
export class InsuranceService {

  // ! definindo as constantes de precificacao ! \\

  private readonly brand_price = 1000;

  private readonly fuel_price = 600;

  private readonly transmission_price = 600;

  private readonly year_price = 600;
  private readonly year_range = [2010, 2020, 0.3] as const; // [min, max, factor]

  private readonly fipe_percent = 0.001;
  private readonly odometer_percent = 0.0001;

  private readonly age_range = [21, 65, 0.2, 0.5] as const; // [min, max, factor_in, factor_out]
  private readonly age_price = 500;

  private readonly gender_price = 150;

  private readonly marital_status_price = 200;

  private readonly license_years_price = 400;
  private readonly license_years_range = [1, 10, 0.5] as const; // [min, max, factor]

  private readonly location_price = 300;

  private readonly park_price = 250;

  private readonly vehicle_use_price = 200;

  private readonly recorrency_price = 1000;

  // ! fim da declaracao ! \\

  constructor(

    @InjectRepository(Insurance)
    private readonly insuranceRepository: Repository<Insurance>,

    private readonly conductorsService: ConductorService,

    private readonly configService: ConfigService,

    private readonly hettpService: HttpService,

  ) { }

  async create(createInsuranceDto: CreateInsuranceDto) {
    const insurancePayload = createInsuranceDto;

    const insuranceInstance = this.insuranceRepository.create(insurancePayload);
    await this.insuranceRepository.save(insuranceInstance);

    const { user, vehicle, ...rest } = insuranceInstance;

    return rest;
  }

  findAll() {
    return `This action returns all insurance`;
  }

  async findOne(id: number) {
    let insurance: any = await this.insuranceRepository.find({
      where: {
        id_insurance: id
      },
      relations: ['vehicle']
    });

    if (!insurance)
      throw new NotFoundException('seguro nao encontrado');

    const { userId, ...vehicle } = insurance[0].vehicle

    insurance[0].vehicle = vehicle;

    return insurance[0];
  }

  async findOne_entity(id: number) {
    const insurance = await this.insuranceRepository.findOne({
      where: {
        id_insurance: id,
      },
      relations: ['vehicle', 'user'],
    });

    if (!insurance)
      throw new NotFoundException('seguro nao encontrado');

    return insurance;
  }

  async update(id: number, updateInsuranceDto: UpdateInsuranceDto) {
    const insurance = await this.findOne_entity(id);
    //insurance.estimated_price = updateInsuranceDto.estimated_price;
    //return this.insuranceRepository.save(insurance);
  }

  async updatePrice(id: number, price: number)
  {
    const insurance = await this.findOne_entity(id);
    insurance.estimated_price = price;
    const updated = await this.insuranceRepository.save(insurance);
    return updated;
  }

  remove(id: number) {
    return `This action removes a #${id} insurance`;
  }


  async findAll_by_user(userId: number) {
    const insurances = await this.insuranceRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['vehicle'],
    });

    if (!insurances.length)
      throw new NotFoundException('seguro nao encontrado');

    const insurancesWithoutUser: any = [];

    insurances.forEach(ins => {
      const { userId, ...rest } = ins.vehicle;

      const aux = {
        ...ins,
        vehicle: rest
      };

      insurancesWithoutUser.push(aux);
    });

    return insurancesWithoutUser;
  }

  async findAll_entities_by_user(userId: number) {
    const insurances = await this.insuranceRepository.find({
      where: {
        user: {id: userId},
      },
      relations: ['vehicle'],
    });

    if (!insurances.length)
      throw new NotFoundException('seguro nao encontrado');
      
    return insurances;
  }

  async find_by_vehicle(vehicleId: number) {
    const insurance = await this.insuranceRepository.find({
      where: {
        vehicle: { id: vehicleId },
      },
      loadEagerRelations: false,
    });

    if (!insurance)
      throw new NotFoundException('seguro nao encontrado');

    return insurance[0];
  }

  async findAllPending() {
    const insurances = await this.insuranceRepository.find({
      where: {
        status: Status.Pending,
      },
      relations: ['vehicle'],
    });

    if (!insurances || !insurances.length) {
      throw new NotFoundException('Nenhum seguro pendente foi encontrado');
    }

    const insurancesWithoutUser: any = [];

    insurances.forEach(ins => {
      const { userId, ...rest } = ins.vehicle;

      const aux = {
        ...ins,
        vehicle: rest,
      };

      insurancesWithoutUser.push(aux);
    });

    return insurancesWithoutUser;
  }

  async findAllPending_by_user(userId: number) {
    const insurances = await this.insuranceRepository.find({
      where: {
        user: { id: userId },
        status: Status.Pending,
      },
      relations: ['vehicle'],
    });

    if (!insurances || !insurances.length) {
      throw new NotFoundException('Nenhum seguro pendente foi encontrado');
    }

    const insurancesWithoutUser: any = [];

    insurances.forEach(ins => {
      const { userId, ...rest } = ins.vehicle;

      const aux = {
        ...ins,
        vehicle: rest,
      };

      insurancesWithoutUser.push(aux);
    });

    return insurancesWithoutUser;
  }


  async evaluate_insurance(evaluateInsuranceDto: EvaluateInsuranceDto) {
    const { id_insurance, status } = evaluateInsuranceDto;

    const insurance = await this.findOne_entity(id_insurance);

    if (!insurance) {
      throw new NotFoundException('Seguro não encontrado');
    }

    if (insurance.status !== Status.Pending) {
      throw new BadRequestException(
        `Este seguro não pode ser avaliado, pois seu status já é "${Status[insurance.status]}"`
      );
    }

    const conductors = await this.conductorsService.findAllByVehicle(insurance.vehicle.id);

    for (const cond of conductors) {
      const { telephone, ...rest } = cond;
      rest.status = ConductorStatus.ACCEPTED;
      this.conductorsService.update_entity(rest);
    }

    insurance.status = status;

    return await this.insuranceRepository.save(insurance);
  }

  async update_entity(insurance: Insurance) {
    return await this.insuranceRepository.save(insurance);
  }

  calculate_cost_for_vehicle(
    motorizationString: MotorizationType,
    vehicleBrand: Brands,
    vehicleTransmission: TransmissionType,
    vehicleYear: number,
    vehicleFipe: number,
    vehicleOdometer: number,
  ): number {
    const brand_user = BrandsWeight[Brands[vehicleBrand] as keyof typeof BrandsWeight];
    if (brand_user === undefined) throw new BadRequestException(`Marca inválida: ${vehicleBrand}`);

    const fuel_type_user = MotorizationWeight[motorizationString as keyof typeof MotorizationWeight];
    if (fuel_type_user === undefined) throw new BadRequestException(`Tipo de combustível inválido: ${motorizationString}`);

    const transmission_user = TransmissionWeight[vehicleTransmission as keyof typeof TransmissionWeight];
    if (transmission_user === undefined) throw new BadRequestException(`Tipo de transmissão inválida: ${vehicleTransmission}`);

    let price = 0;

    price += this.brand_price * brand_user;
    price += this.fuel_price * fuel_type_user;
    price += this.transmission_price * transmission_user;
    price += this.year_price * this.year_price_calc(vehicleYear);
    price += vehicleFipe * this.fipe_percent;
    price += Number(vehicleOdometer) * this.odometer_percent;

    return price;
  }

  async calculate_cost_for_user(
    genderType: GenderTypes,
    marital_statusType: MaritalStatusType,
    park_type: ParkType,
    vehicle_use: VehicleUseType,
    cnhIssueDate: Date,
    age: number,
    user_cep: string,
    model: string,
  ) {
    const gender = GenderWeight[genderType as keyof typeof GenderWeight];
    if (gender === undefined) throw new BadRequestException(`Gênero inválido: ${genderType}`);

    const marital_status = MaritalStatusWeight[marital_statusType as keyof typeof MaritalStatusWeight];
    if (marital_status === undefined) throw new BadRequestException(`Estado civil inválido: ${marital_statusType}`);

    const park_user = ParkWeight[park_type as keyof typeof ParkWeight];
    if (park_user === undefined) throw new BadRequestException(`Tipo de estacionamento inválido: ${park_type}`);

    const vehicle_use_user = VehicleUseWeight[vehicle_use as keyof typeof VehicleUseWeight];
    if (vehicle_use_user === undefined) throw new BadRequestException(`Tipo de uso do veículo inválido: ${vehicle_use}`);

    const user_license_years = this.calculateFullYears(cnhIssueDate);

    let price = 0;

    price += this.age_price * this.calc_age(age);
    price += this.gender_price * gender;
    price += this.marital_status_price * marital_status;
    price += this.license_years_price * this.calc_license_years(user_license_years);
    price += await this.evaluate_user_location(user_cep, model); // ! mudar 
    price += this.park_price * park_user;
    price += this.vehicle_use_price * vehicle_use_user;

    return price;
  }

  calculate_conductors_price(
    genderType: GenderTypes,
    marital_statusType: MaritalStatusType,
    cnhIssueDate: Date,
    age: number,
  ): number {
    let price = 0;

    const gender = GenderWeight[genderType as keyof typeof GenderWeight];
    if (gender === undefined) throw new BadRequestException(`Gênero inválido: ${genderType}`);

    const marital_status = MaritalStatusWeight[marital_statusType as keyof typeof MaritalStatusWeight];
    if (marital_status === undefined) throw new BadRequestException(`Estado civil inválido: ${marital_statusType}`);

    const user_license_years = this.calculateFullYears(cnhIssueDate);

    // Preço do user
    price += this.age_price * this.calc_age(age);
    price += this.gender_price * gender;
    price += this.marital_status_price * marital_status;
    price += this.license_years_price * this.calc_license_years(user_license_years);

    return 0.5 * price;
  }

  private year_price_calc(year_calc: number): number {
    if (year_calc >= this.year_range[0] && year_calc <= this.year_range[1]) {
      return this.year_range[2];
    } else {
      if (year_calc < this.year_range[0]) {
        const diff = this.year_range[0] - year_calc;
        return this.year_range[2] * (1 + (diff / 100)); // Aumenta 0.1% por ano fora
      } else {
        const diff = year_calc - this.year_range[1];
        return this.year_range[2] * (1 + (diff / 10)); // Aumenta 10% por ano fora
      }
    }
  }

  private calc_age(user_age: number): number {
    if (user_age >= this.age_range[0] && user_age <= this.age_range[1]) {
      return this.age_range[2]; // factor_in
    } else {
      return this.age_range[3]; // factor_out
    }
  }

  private calc_license_years(license_years: number): number {
    if (license_years >= this.license_years_range[0] && license_years <= this.license_years_range[1]) {
      return this.license_years_range[2];
    } else {
      if (license_years < this.license_years_range[0]) {
        const diff = this.license_years_range[0] - license_years;
        return this.license_years_range[2] * (1 + (diff / 10)); // Aumenta 10% por ano fora
      } else {
        const diff = license_years - this.license_years_range[1];
        return this.license_years_range[2] * (1 + (diff / 100)); // Aumenta 0.1% por ano fora
      }
    }
  }

  private async evaluate_user_location(cep: string, car_model: string): Promise<number> {

    // ! cep, dis, car_model
    let price = 0;

    try {
      const apiIp = this.configService.get<String>('AI_PYTHON_SERVER_IP');
      const apiPort = this.configService.get<String>('AI_PYTHON_SERVER_PORT');

      const apiUrl = `http://${apiIp}:${apiPort}/estimate_details`;

      const requestBody = {
        cep: cep,
        car_model: car_model
      };

      const response = await firstValueFrom(this.hettpService.post(apiUrl, requestBody));

      console.log('respota da API: ', response.data);

      const responseData = response.data;

      price = Number(responseData.car.robbery_recorrency) * this.recorrency_price;

      console.log('robbery_recorrency * recorrency_price: ', price);

    } catch (error) {
      console.error('Erro ao chamar a API externa:', error.response?.data || error.message);

      throw new InternalServerErrorException('Falha ao validar dados com o serviço externo.');
    }

    return price;
  }

  private calculateFullYears(issueDate: Date): number {
    const cnhDate = new Date(issueDate);
    const today = new Date();

    let years = today.getFullYear() - cnhDate.getFullYear();

    const currentMonth = today.getMonth(); // 0-11
    const issueMonth = cnhDate.getMonth(); // 0-11

    const currentDay = today.getDate(); // 1-31
    const issueDay = cnhDate.getDate(); // 1-31

    if (currentMonth < issueMonth || (currentMonth === issueMonth && currentDay < issueDay)) {
      years--; // Subtrai 1 ano
    }

    return Math.max(0, years);
  }

}
