import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateConductorDto } from "src/conductors/conductor/dto/create-conductor.dto";

export class AddConductorsDto {

    conductors: CreateConductorDto[];

    @IsNumber()
    @IsNotEmpty()
    id_insurance: number;
}