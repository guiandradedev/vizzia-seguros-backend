import { IsNumber, IsNotEmpty, IsEnum, IsString, IsOptional, IsBoolean } from "class-validator";
import { AssistanceType } from "../enum/assistance-type.enum";

export class CreateAssistanceDto {
    @IsNumber()
    @IsNotEmpty()
    vehicleId: number;

    @IsEnum(AssistanceType)
    @IsNotEmpty()
    type: AssistanceType;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    location?: string;
}


export class ApproveAssistanceDto {
    @IsNumber()
    id_assistance: number;
    
    @IsBoolean()
    approve: boolean
}