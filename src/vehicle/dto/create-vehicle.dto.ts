import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { MotorizationType } from "../enums/motorization-types.enum";
import { Brands } from "../enums/brand.enum";
import { TransmissionType } from "../enums/transmission-type.enum";

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

    @IsString()
    @IsNotEmpty()
    year: number;

    @IsString()
    @IsNotEmpty()
    odometer: string;

    @IsNotEmpty()
    @IsEnum(Brands)
    brand: Brands;

    // @IsNumber()
    @IsNotEmpty()
    motorization: number;

    @IsEnum(TransmissionType)
    transmission: TransmissionType;

    @IsOptional()
    photos?: any;

    @IsString()
    usage: string;

    @IsNumber()
    fipe_moment: number;
}
