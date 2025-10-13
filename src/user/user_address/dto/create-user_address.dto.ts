import { User } from 'src/user/users/entities/user.entity'
import { Address } from 'src/address/entities/address.entity'
import { IsNumber, IsNotEmpty } from "class-validator";
import { CreateAddressDto } from 'src/address/dto/create-address.dto'

export class CreateUserAddressDto {
    @IsNotEmpty()
    userId: User;

    @IsNotEmpty()
    address: CreateAddressDto;
}

