import { IsNotEmpty, IsNumber } from "class-validator";
import { User } from "src/user/users/entities/user.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";

export class UpdateInsuranceDto {
    @IsNumber()
    @IsNotEmpty()
    estimated_price: number;
}
