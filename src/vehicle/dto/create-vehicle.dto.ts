import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { MotorizationType } from "../enums/motorization-types.enum";
import { Brands } from "../enums/brand.enum";
import { TransmissionType } from "../enums/transmission-type.enum";
import { ParkType } from "src/address/enums/park_type.enum";
import { VehicleUseType } from "../enums/vehicle_use-types.enum";

export class CreateVehicleDto {
    @IsString()
    @IsNotEmpty()
    plate: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsString()
    @IsNotEmpty()
    odometer: string;

    @IsNotEmpty()
    brand: number;

    // @IsNumber()
    @IsNotEmpty()
    motorization: number;

    @IsEnum(TransmissionType)
    transmission: TransmissionType;

    @IsEnum(VehicleUseType)
    use_type: VehicleUseType;

    @IsEnum(ParkType)
    park_type: ParkType;
}

export class CreateVehicleDraft {
    @IsString()
    @IsNotEmpty()
    plate: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsString()
    @IsNotEmpty()
    odometer: string;

    @IsNotEmpty()
    // @IsEnum(Brands)
    brand: number;

    // @IsNumber()
    @IsNotEmpty()
    motorization: number;

    @IsEnum(TransmissionType)
    transmission: TransmissionType;

    @IsEnum(VehicleUseType)
    use_type: VehicleUseType;

    @IsNumber()
    fipe: number;

    @IsEnum(ParkType)
    park_type: ParkType;
}
