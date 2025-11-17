import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { Status } from "../enum/status.enum";

export class EvaluateInsuranceDto {
    @IsNotEmpty()
    @IsNumber()
    id_insurance: number;

    @IsEnum(Status)
    @IsNotEmpty()
    status: Status;
}