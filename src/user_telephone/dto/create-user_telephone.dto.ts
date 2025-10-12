import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateTelephoneDto } from "src/telephone/dto/create-telephone.dto";
import { User } from "src/users/entities/user.entity";

export class CreateUserTelephoneDto {
    @IsNotEmpty()
    @IsNumber()
    userId: User;

    @IsNotEmpty()
    telephone: CreateTelephoneDto;
}
