import { IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength, MinLength } from "class-validator";
import { GenderTypes } from "src/user/users/enums/gender-type.enum";
import { MaritalStatusType } from "src/user/users/enums/marital_status-Type.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('conductor')
export class Conductor {

    @PrimaryGeneratedColumn({ name: 'id_conductor', type: 'int' })
    id: number;

    @Column({ length: 100, type: 'varchar' })
    @IsString()
    name: string;


    @Column({ length: 100, unique: true })
    @MaxLength(100)
    @IsEmail()
    email: string;

    @Column({ length: 11, type: 'varchar' })
    @IsNumberString()
    @MaxLength(11)
    @MinLength(11)
    cnhNumber: string;

    @Column({ length: 11, unique: true })
    @MaxLength(11)
    @MinLength(11)
    @IsNumberString()
    cpf: string;

    @Column({ type: 'date', nullable: false })
    @IsNotEmpty()
    @IsDateString()
    birthDate: string;

    @Column({ type: 'date', nullable: false })
    @IsNotEmpty()
    @IsDateString()
    cnhIssueDate: Date;

    @Column({ type: 'date', nullable: false })
    @IsNotEmpty()
    @IsDateString()
    cnhExpiryDate: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    @IsString()
    relationship?: string;

    @Column({type: 'int'})
    @IsNumber()
    age: number;

    @IsEnum(GenderTypes)
    @Column({ enum: GenderTypes, type: 'enum' })
    gender: GenderTypes;

    @IsEnum(MaritalStatusType)
    @Column({enum: MaritalStatusType, type: 'enum'})
    marital_status: MaritalStatusType;
}
