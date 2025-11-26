import { Conductor } from "src/conductors/conductor/entities/conductor.entity";
import { Insurance } from "src/insurance/entities/insurance.entity";
import { EndorsementType, EndorsementStatus } from "../entities/insurance-endorsement.entity";
import { IsEnum, IsNumber } from "class-validator";

export class CreateInsuranceEndorsementDto {
    @IsEnum(EndorsementType)
    type: EndorsementType;

    @IsEnum(EndorsementStatus)
    status: EndorsementStatus;

    @IsNumber()
    value_change: number;

    insurance: Insurance;

    target_conductor: Conductor;
}
