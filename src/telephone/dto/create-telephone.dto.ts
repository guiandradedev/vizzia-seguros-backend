import { IsEnum, IsNotEmpty, IsNumberString, Length } from "class-validator";
import { TelephoneType } from "../entities/telephone.entity";

export class CreateTelephoneDto {

    @IsNumberString()
    @IsNotEmpty()
    @Length(11, 11)
    phone_number: string;

    @IsEnum(TelephoneType)
    @IsNotEmpty()
    type: TelephoneType;
}
