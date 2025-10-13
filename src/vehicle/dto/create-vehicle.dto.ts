import { IsNotEmpty, IsString } from "class-validator";

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
}
