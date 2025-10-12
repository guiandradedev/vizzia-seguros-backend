import { User } from 'src/users/entities/user.entity'
import { Address } from 'src/address/entities/address.entity'
import { IsNumber, IsNotEmpty } from "class-validator";
import { CreateAddressDto } from 'src/address/dto/create-address.dto'

export class CreateUserAddressDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    address: CreateAddressDto;
}

