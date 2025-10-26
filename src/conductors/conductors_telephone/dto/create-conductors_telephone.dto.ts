import { IsNotEmpty } from "class-validator";
import { Conductor } from "src/conductors/conductor/entities/conductor.entity";
import { CreateTelephoneDto } from "src/telephone/dto/create-telephone.dto";

export class CreateConductorsTelephoneDto {

    @IsNotEmpty()
    conductorId: Conductor;

    @IsNotEmpty()
    telephone: CreateTelephoneDto;

}
