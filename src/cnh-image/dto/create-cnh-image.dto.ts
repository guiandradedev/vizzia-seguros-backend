import { IsNumberString } from "class-validator";

export class CreateCnhImageDto {
    @IsNumberString()
    id: string;
}
