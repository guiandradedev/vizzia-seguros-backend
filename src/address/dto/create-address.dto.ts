import { MaxLength, IsNotEmpty, IsString, IsNumberString, IsOptional } from "class-validator";

export class CreateAddressDto {
        @MaxLength(100)
        @IsNotEmpty()
        @IsString()
        street: string;
    
        @MaxLength(100)
        @IsNotEmpty()
        @IsString()
        neighborhood: string;
    
        @MaxLength(100)
        @IsNotEmpty()
        @IsString()
        city: string;

        @IsNotEmpty()
        @MaxLength(5)
        @IsNumberString()
        addressNumber: string;

        @IsOptional()
        @MaxLength(100)
        complement?: string;
    
        @MaxLength(2)
        @IsNotEmpty()
        @IsString()
        state: string;

        @MaxLength(11)
        @IsNotEmpty()
        @IsString()
        cep: string;
}