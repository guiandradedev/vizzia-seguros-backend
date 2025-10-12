import { IsNumber, IsNotEmpty } from "class-validator";
import { CreateAddressDto } from 'src/address/dto/create-address.dto'
import { CreateCnhImageDto } from "src/cnh-image/dto/create-cnh-image.dto";

export class CreateUserCnhDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}

