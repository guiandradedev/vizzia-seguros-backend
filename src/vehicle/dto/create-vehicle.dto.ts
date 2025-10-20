import { IsEnum, IsNotEmpty, IsString } from "class-validator";
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

    @IsEnum(MotorizationType)
    @IsNotEmpty()
    motorization: MotorizationType;
}
