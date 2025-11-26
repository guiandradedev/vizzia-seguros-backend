import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { CreateConductorDto } from "src/conductors/conductor/dto/create-conductor.dto";

export class AddConductorsDto {

    @IsArray()
    @Type(() => CreateConductorDto)
    conductors: CreateConductorDto[];

    @IsNumber()
    @IsNotEmpty()
    id_insurance: number;
}