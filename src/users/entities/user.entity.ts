import { IsString } from "@nestjs/class-validator";
import { IsEmail, MaxLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn({name: 'id_user', type: 'int'})
    id: number;

    @Column({length: 100})
    @IsString()
    name: string;

    @Column({length: 100, unique: true})
    @MaxLength(100)
    @IsEmail()
    email: string;

    @Column({length: 100})
    passwordHash: string;
}
