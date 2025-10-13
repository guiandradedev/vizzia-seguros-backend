import { IsDateString, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { IsEmail, MaxLength, MinLength, IsNumberString } from "class-validator";
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
    @IsString()
    passwordHash: string;

    @Column({length: 11, type:'varchar'})
    @IsNumberString()
    @MaxLength(11)
    @MinLength(11)
    cnhNumber: string;

    @Column({length: 11, unique: true})
    @MaxLength(11)
    @MinLength(11)
    @IsNumberString()
    cpf: string;

    @Column({ type: 'date', nullable: false })
    @IsNotEmpty()
    @IsDateString()
    birthDate: string;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    @IsNotEmpty()
    status: boolean;

    @Column({ type: 'date', nullable: false })
    @IsNotEmpty()
    @IsDateString()
    cnhIssueDate: Date;
}
