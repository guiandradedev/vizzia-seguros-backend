import { IsBoolean, IsNumber } from "class-validator";

export class EvaluateEndorsementDto {
    @IsNumber()
    id_endosement: number;

    @IsBoolean()
    approve: boolean;
}