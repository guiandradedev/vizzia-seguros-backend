import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { CreateConductorDto } from "src/conductors/conductor/dto/create-conductor.dto";

export class AssignConductorsDto {
    @IsNumber()
    @Type(() => Number)
    id_vehicle: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateConductorDto)
    conductors: CreateConductorDto[];
}