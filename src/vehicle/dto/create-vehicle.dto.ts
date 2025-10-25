import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { MotorizationType } from "../enums/motorization-types.enum";

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

    @IsString()
    @IsNotEmpty()
    brand: string;

    // @IsNumber()
    @IsNotEmpty()
    motorization: number;

    @IsOptional()
    photos?: any;
}
