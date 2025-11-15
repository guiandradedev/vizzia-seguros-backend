import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleImage } from './entities/vehicle-image.entity';
import { DataSource } from 'typeorm';
import { User } from 'src/user/users/entities/user.entity';
import { MotorizationTypeReverseMap } from './map/motorization-type.map';
import { AssignConductorsDto } from './dto/assignconductors.dto';
import { Conductor } from 'src/conductors/conductor/entities/conductor.entity';
import { ConductorService } from 'src/conductors/conductor/conductor.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { IStep3Data, VehicleDrafts } from './drafts/vehicle-drafs.draft';
import { Cache } from '@nestjs/cache-manager';
import { CreateConductorDto } from 'src/conductors/conductor/dto/create-conductor.dto';
import { Brands, BrandsWeight } from './enums/brand.enum';
import { MotorizationWeight } from './enums/motorization-types.enum';
import { TransmissionWeight } from './enums/transmission-type.enum';
import { GenderWeight } from 'src/user/users/enums/gender-type.enum';
import { MaritalStatusWeight } from 'src/user/users/enums/marital_status-Type.enum';
import { ParkWeight } from 'src/address/enums/park_type.enum';
import { VehicleUseWeight } from './enums/vehicle_use-types.enum';
import { UsersService } from 'src/user/users/users.service';
import { CreateInsuranceDto } from 'src/insurance/dto/create-insurance.dto';
import { InsuranceService } from 'src/insurance/insurance.service';
import { Insurance } from 'src/insurance/entities/insurance.entity';

@Injectable()
export class VehicleService {

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

  // ! fim da declaracao ! \\


  constructor(
    private readonly conductorService: ConductorService,

    private readonly insuranceService: InsuranceService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(VehicleImage)
    private readonly vehicleImageRepository: Repository<VehicleImage>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    private readonly dataSource: DataSource,
  ) { }

  private getDraftKey(userId: number): string {
    return `draft:vechicle:user:${userId}`;
  }

  async create(
    createVehicleDto: CreateVehicleDto,
    userID: number,
    photos: Array<Express.Multer.File>, // array de arquivos do multer
    photosMeta: string | any[] | undefined, // metadata: JSON string ou array de objetos { file, type } ou array de tipos
  ) {

    const { motorization, ...restDto } = createVehicleDto;

    const motorizationString = MotorizationTypeReverseMap[createVehicleDto.motorization];

    // parsear photosMeta
    const parsedPhotosMeta: any[] = (() => {
      if (!photosMeta) return [];
      if (Array.isArray(photosMeta)) return photosMeta;
      try {
        const parsed = JSON.parse(String(photosMeta));
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { /* ignore */ }
      return [];
    })();

    if (!Array.isArray(photos) || photos.length === 0)
      throw new BadRequestException('At least one photo is required');

    // se metadata for array simples de strings, exige mesma quantidade
    const simpleStringsMeta = parsedPhotosMeta.length > 0 && parsedPhotosMeta.every(m => typeof m === 'string');
    if (simpleStringsMeta && parsedPhotosMeta.length !== photos.length)
      throw new BadRequestException('Number of photo types must match number of photos');

    return this.dataSource.transaction(async (manager) => {

      const vehicleInstance = manager.create(Vehicle, {
        motorization: motorizationString,
        ...restDto,
        userId: { id: userID } as User,
      });

      const savedVehicle = await manager.save(vehicleInstance);

      // helper para obter tipo para cada arquivo
      const getTypeForFile = (file: Express.Multer.File, idx: number) => {
        // 1) se meta na mesma posição é string -> usa
        if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'string') return parsedPhotosMeta[idx];

        // 2) se meta na mesma posição é objeto com type -> usa
        if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'object' && parsedPhotosMeta[idx].type) return parsedPhotosMeta[idx].type;

        // 3) buscar por nome do arquivo em objetos meta: campos comuns file, originalname, fileName
        const found = parsedPhotosMeta.find(m =>
          m && typeof m === 'object' && (
            m.file === file.originalname ||
            m.originalname === file.originalname ||
            m.fileName === file.originalname
          )
        );
        if (found && found.type) return found.type;

        // 4) fallback: primeira imagem = 'initial' (ou 'inicial' conforme envio), demais = 'extra'
        return idx === 0 ? 'initial' : 'extra';
      };

      const vehicleImageEntities = photos.map((file, idx) =>
        manager.create(VehicleImage, {
          path: file.path,
          type: getTypeForFile(file, idx),
          vehicle: savedVehicle,
        })
      );

      await manager.save(vehicleImageEntities);

      const foundVehicle = await manager.findOne(Vehicle, {
        where: { id: savedVehicle.id },
        relations: {
          images: false,
        }
      });

      if (!foundVehicle)
        throw new NotFoundException('Vehicle not found after save');

      const { userId, ...vehicle } = foundVehicle;
      return vehicle;
    });
  }

  async addImages(
    id_vehicle: number,
    photos: Array<Express.Multer.File>,
    photosMeta: string | any[] | undefined,
  ) {
    const vehicle = await this.vehicleRepository.findOneBy({ id: id_vehicle });

    if (!vehicle)
      throw new NotFoundException('Vehicle not found');

    // parsear photosMeta: string JSON -> array | já array -> usar | undefined -> []
    const parsedPhotosMeta: any[] = (() => {
      if (!photosMeta) return [];
      if (Array.isArray(photosMeta)) return photosMeta;
      try {
        const parsed = JSON.parse(String(photosMeta));
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) { /* ignore */ }
      return [];
    })();

    if (!Array.isArray(photos) || photos.length === 0)
      throw new BadRequestException('At least one photo is required');

    // se meta for array de strings, admite tamanho 1 (aplica primeiro) ou igual ao número de arquivos
    const simpleStringsMeta = parsedPhotosMeta.length > 0 && parsedPhotosMeta.every(m => typeof m === 'string');
    if (simpleStringsMeta && !(parsedPhotosMeta.length === 1 || parsedPhotosMeta.length === photos.length))
      throw new BadRequestException('Number of image types must match number of photos');

    const getTypeForFile = (file: Express.Multer.File, idx: number) => {
      if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'string') return parsedPhotosMeta[idx];
      if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'object' && parsedPhotosMeta[idx].type) return parsedPhotosMeta[idx].type;

      // procurar por correspondência de nome do arquivo
      const found = parsedPhotosMeta.find(m =>
        m && typeof m === 'object' && (
          m.file === file.originalname ||
          m.originalname === file.originalname ||
          m.fileName === file.originalname
        )
      );
      if (found && found.type) return found.type;

      // se meta é array de strings com 1 item, aplicar ao primeiro
      if (simpleStringsMeta && parsedPhotosMeta.length === 1 && idx === 0) return parsedPhotosMeta[0];

      return 'extra';
    };

    const imageEntities = photos.map((file, idx) =>
      this.vehicleImageRepository.create({
        path: file.path,
        type: getTypeForFile(file, idx),
        vehicle: vehicle,
      })
    );

    await this.vehicleRepository.save(vehicle);

    const saved = await this.vehicleImageRepository.save(imageEntities);

    return saved;
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepository.findOneBy({ id });

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const images = await this.vehicleImageRepository.find({
      where: { vehicle: { id: vehicle.id } },
      order: { id: 'ASC' },
    });

    const filePaths = images.map(img => ({
      id: img.id,
      path: img.path,
      type: img.type,
      // Include the file itself if needed, assuming you have access to the file storage
      file: img.path // Adjust this line based on how you manage file access
    }));

    const { userId, ...vehicleWithoutUser } = vehicle;
    return {
      ...vehicleWithoutUser,
      images: filePaths,
      conductors: await this.conductorService.findAllByVehicle(vehicle.id),
    };
  }

  async assignConductors(assignConductorsDto: AssignConductorsDto, userId: number) {
    const vehicle = await this.vehicleRepository.findOneBy({ id: assignConductorsDto.id_vehicle });

    if (!vehicle)
      throw new NotFoundException('Vehicle not found');


    if (vehicle.userId.id != userId)
      throw new BadRequestException('You do not have permission to assign conductors to this vehicle');

    const createdConductors: Conductor[] = [];

    for (const conductorDto of assignConductorsDto.conductors) {
      const created = await this.conductorService.create(conductorDto, vehicle.id);
      createdConductors.push(created);
    }

    await this.vehicleRepository.save(vehicle);

    return createdConductors;
  }


  async findAllVehiclesByUser(userId: number) {
    let veiculos = await this.vehicleRepository.find({
      where: {
        userId: { id: userId },
      }
    });

    if (!veiculos || veiculos.length === 0)
      throw new NotFoundException('No vehicles found for this user');

    const vehiclesWithConductors = await Promise.all(veiculos.map(async v => {
      const conductors = await this.conductorService.findAllByVehicle(v.id);
      return { ...v, conductors };
    }));

    return vehiclesWithConductors.map(({ userId, ...vehicle }) => vehicle);
  }


  async deleteVehicle(id: number, userId: number) {
    const vehicle = await this.vehicleRepository.findOneBy({ id });

    if (!vehicle)
      throw new NotFoundException('Vehicle not found');

    if (vehicle.userId.id != userId)
      throw new ForbiddenException('You do not have permission to delete this vehicle');

    await this.vehicleRepository.remove(vehicle);

    return { message: 'Vehicle deleted successfully' };
  }

  async saveStep1_create_vehicle(userId: number, createVehicleDto: CreateVehicleDto) {
    const key = this.getDraftKey(userId);
    const draft: VehicleDrafts = { step1: createVehicleDto };
    await this.cacheManager.set(key, draft);
    return draft;
  }

  async saveStep2_assign_conductors(userId: number, createConductors: CreateConductorDto[]) {
    const key = this.getDraftKey(userId);
    const draft = await this.cacheManager.get<VehicleDrafts>(key);

    if (!draft || !draft.step1) {
      throw new BadRequestException('Requer criar o veiculos primeiramente');
    }

    const updatedDraft: VehicleDrafts = { ...draft, step2: createConductors };
    await this.cacheManager.set(key, updatedDraft);
    return updatedDraft;
  }

  async saveStep3_photos(
    userId: number,
    photos: Array<Express.Multer.File>, // array de arquivos do multer
    photosMeta: string | any[] | undefined, // metadata
  ) {
    const key = this.getDraftKey(userId);
    const draft = await this.cacheManager.get<VehicleDrafts>(key);

    // 1. Validar Rascunho existente
    if (!draft || !draft.step1 || !draft.step2) {
      throw new BadRequestException('As etapas 1 (veículo) e 2 (condutores) devem ser preenchidas primeiro.');
    }

    // --- Início: Lógica de Fotos (copiada do seu método create) ---
    const parsedPhotosMeta: any[] = (() => {
      if (!photosMeta) return [];
      if (Array.isArray(photosMeta)) return photosMeta;
      try {
        const parsed = JSON.parse(String(photosMeta));
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { /* ignore */ }
      return [];
    })();

    if (!Array.isArray(photos) || photos.length === 0)
      throw new BadRequestException('Pelo menos uma foto é obrigatória (etapa 3)');

    const simpleStringsMeta = parsedPhotosMeta.length > 0 && parsedPhotosMeta.every(m => typeof m === 'string');
    if (simpleStringsMeta && parsedPhotosMeta.length !== photos.length)
      throw new BadRequestException('O número de tipos de fotos deve corresponder ao número de fotos');

    const getTypeForFile = (file: Express.Multer.File, idx: number) => {
      if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'string') return parsedPhotosMeta[idx];
      if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'object' && parsedPhotosMeta[idx].type) return parsedPhotosMeta[idx].type;
      const found = parsedPhotosMeta.find(m =>
        m && typeof m === 'object' && (
          m.file === file.originalname ||
          m.originalname === file.originalname ||
          m.fileName === file.originalname
        )
      );
      if (found && found.type) return found.type;
      return idx === 0 ? 'initial' : 'extra';
    };
    // --- Fim: Lógica de Fotos ---

    // 2. Criar os dados da Etapa 3
    // O Multer já salvou os arquivos, só precisamos dos caminhos e tipos.
    const step3Data: IStep3Data[] = photos.map((file, idx) => ({
      path: file.path,
      type: getTypeForFile(file, idx),
    }));

    // 3. Salvar o rascunho completo no Redis
    const updatedDraft: VehicleDrafts = { ...draft, step3: step3Data };
    await this.cacheManager.set(key, updatedDraft);

    return updatedDraft;
  }


  async step4_estimate_price(userID: number) {
    const key = this.getDraftKey(userID);
    const draft = await this.cacheManager.get<VehicleDrafts>(key);

    // 1. Validar Rascunho
    if (!draft) {
      throw new NotFoundException('Nenhum rascunho de veículo encontrado.');
    }
    if (!draft.step1) {
      throw new BadRequestException('Dados do veículo (Etapa 1) estão faltando no rascunho.');
    }
    if (!draft.step2 || draft.step2.length === 0) {
      throw new BadRequestException('Dados do condutor (Etapa 2) estão faltando no rascunho.');
    }

    // 2. Extrair dados
    // NOTA: Assumindo que os DTOs têm os campos necessários (brand, fipe, age, gender, etc.)
    const vehicle = draft.step1;
    const user = await this.usersService.findOne(userID);

    let price = 0;

    // --- 3. Cálculo do Veículo ---
    const motorizationString = MotorizationTypeReverseMap[vehicle.motorization];

    // Fatores (com validação)
    const brand_user = BrandsWeight[Brands[vehicle.brand] as keyof typeof BrandsWeight];
    if (brand_user === undefined) throw new BadRequestException(`Marca inválida: ${vehicle.brand}`);

    const fuel_type_user = MotorizationWeight[motorizationString as keyof typeof MotorizationWeight];
    if (fuel_type_user === undefined) throw new BadRequestException(`Tipo de combustível inválido: ${motorizationString}`);

    const transmission_user = TransmissionWeight[vehicle.transmission as keyof typeof TransmissionWeight];
    if (transmission_user === undefined) throw new BadRequestException(`Tipo de transmissão inválida: ${vehicle.transmission}`);

    // Preço do Veículo
    price += this.brand_price * brand_user;
    price += this.fuel_price * fuel_type_user;
    price += this.transmission_price * transmission_user;
    price += this.year_price * this.year_price_calc(vehicle.year);
    price += vehicle.fipe * this.fipe_percent;
    price += Number(vehicle.odometer) * this.odometer_percent;

    // --- 4. Cálculo do Usuário ---
    const gender = GenderWeight[user.gender as keyof typeof GenderWeight];
    if (gender === undefined) throw new BadRequestException(`Gênero inválido: ${user.gender}`);

    const marital_status = MaritalStatusWeight[user.marital_status as keyof typeof MaritalStatusWeight];
    if (marital_status === undefined) throw new BadRequestException(`Estado civil inválido: ${user.marital_status}`);

    const park_user = ParkWeight[vehicle.park_type as keyof typeof ParkWeight];
    if (park_user === undefined) throw new BadRequestException(`Tipo de estacionamento inválido: ${vehicle.park_type}`);

    const vehicle_use_user = VehicleUseWeight[vehicle.use_type as keyof typeof VehicleUseWeight];
    if (vehicle_use_user === undefined) throw new BadRequestException(`Tipo de uso do veículo inválido: ${vehicle.use_type}`);

    const user_license_years = this.calculateFullYears(user.cnhIssueDate);

    // Preço do user
    price += this.age_price * this.calc_age(user.age);
    price += this.gender_price * gender;
    price += this.marital_status_price * marital_status;
    price += this.license_years_price * this.calc_license_years(user_license_years);
    price += this.location_price * 0.6; // ! mudar 
    price += this.park_price * park_user;
    price += this.vehicle_use_price * vehicle_use_user;

    // --- 5. Calculo dos Condutores ---
    const conductors = draft.step2;

    conductors.forEach(cond => {
      price += this.calculate_conductors_price(cond);
    });

    const updatedDraft: VehicleDrafts = { ...draft, estimated_price_step4: price };
    await this.cacheManager.set(key, updatedDraft);

    return { estimated_price: parseFloat(price.toFixed(2)) };
  }

  async finalize(user_Id: number) {
    const key = this.getDraftKey(user_Id);
    const draft = await this.cacheManager.get<VehicleDrafts>(key);

    // --- 1. Validar o Rascunho COMPLETO
    if (!draft || !draft.step1 || !draft.step2 || !draft.step3 || draft.estimated_price_step4 == undefined || !draft.estimated_price_step4) {
      throw new BadRequestException('Todas as 4 etapas devem ser completas para finalizar o cadastro.');
    }

    const user = await this.usersService.findUserEntityById(user_Id);
    
    // --- 2. Extrair dados do rascunho
    const { step1: createVehicleDto, step2: conductorsDtoArray, step3: imagesDataArray } = draft;
    
    
    // --- salva o veiculo no banco
    
    const {motorization, ...rest} = draft.step1;
    
    const vehiclePayload = {
      ...rest,
      motorization: MotorizationTypeReverseMap[motorization],
      userId: user
    };
    
    const vehicleInstance = this.vehicleRepository.create(vehiclePayload);
    const savedVehicle = await this.vehicleRepository.save(vehicleInstance);
    
    // --- salva condutores no banco
    
    const conductorsDraft = draft.step2;

    const assignConductorsDto: AssignConductorsDto = {
      id_vehicle: savedVehicle.id,
      conductors: conductorsDraft
    };
    
    const savedConductors = await this.assignConductors(assignConductorsDto,user_Id);

    // --- salva o insurance ...
    
    const estimated_price: number = draft.estimated_price_step4;
    
    const insurancePayload: CreateInsuranceDto = {
      user: user,
      vehicle: savedVehicle,
      estimated_price: estimated_price
    };
    
    const insurance = await this.insuranceService.create(insurancePayload);

    await this.dataSource.transaction(async (manager) => {
      // 'imagesDataArray' já tem 'path' e 'type'
      const vehicleImageEntities = imagesDataArray.map(imgData =>
        manager.create(VehicleImage, {
          path: imgData.path,
          type: imgData.type,
          vehicle: savedVehicle,
        })
      );
      await manager.save(vehicleImageEntities);
    });

    await this.cacheManager.del(key);

    const {userId, ...restVehicle} = savedVehicle

    return {
      vehicle: restVehicle,
      conductors: savedConductors,
      insurance: insurance
    }
  }





  // -- metodos auxiliares para estimar o preco -- \\

  private calculate_conductors_price(conductorDto: CreateConductorDto): number {
    let price = 0;

    const gender = GenderWeight[conductorDto.gender as keyof typeof GenderWeight];
    if (gender === undefined) throw new BadRequestException(`Gênero inválido: ${conductorDto.gender}`);

    const marital_status = MaritalStatusWeight[conductorDto.marital_status as keyof typeof MaritalStatusWeight];
    if (marital_status === undefined) throw new BadRequestException(`Estado civil inválido: ${conductorDto.marital_status}`);

    const user_license_years = this.calculateFullYears(conductorDto.cnhIssueDate);

    // Preço do user
    price += this.age_price * this.calc_age(conductorDto.age);
    price += this.gender_price * gender;
    price += this.marital_status_price * marital_status;
    price += this.license_years_price * this.calc_license_years(user_license_years);
    price += this.location_price * 0.6; // ! mudar 

    return 0.4 * price;
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

  private location_factor(location: string): number {
    // Lógica simples do Python, pode ser expandida
    return 0.6;
  }

  private calculateFullYears(issueDate: Date): number {
    // Garante que a entrada é um objeto Date
    const cnhDate = new Date(issueDate);
    const today = new Date();

    // 1. Calcula a diferença inicial de anos
    let years = today.getFullYear() - cnhDate.getFullYear();

    // 2. Obtém os meses e dias para verificar se o "aniversário" da CNH já passou este ano
    const currentMonth = today.getMonth(); // 0-11
    const issueMonth = cnhDate.getMonth(); // 0-11

    const currentDay = today.getDate(); // 1-31
    const issueDay = cnhDate.getDate(); // 1-31

    if (currentMonth < issueMonth || (currentMonth === issueMonth && currentDay < issueDay)) {
      years--; // Subtrai 1 ano
    }

    // Garante que o resultado nunca seja negativo
    return Math.max(0, years);
  }
}
