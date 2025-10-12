import { IsNotEmpty, IsNumberString, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn({name: 'id_address', type: 'int'})
    id: number;

    @Column({length: 100, nullable: false})
    @MaxLength(100)
    @IsNotEmpty()
    @IsString()
    street: string;

    @Column({length: 100, nullable: false})
    @MaxLength(100)
    @IsNotEmpty()
    @IsString()
    neighborhood: string;

    @Column({length: 100, nullable: false})
    @MaxLength(100)
    @IsNotEmpty()
    @IsString()
    city: string;

    @Column({nullable: false})
    @IsNotEmpty()
    @MaxLength(5)
    @IsNumberString()
    addressNumber: string;

    @Column({length: 2, nullable: false})
    @MaxLength(2)
    @IsNotEmpty()
    @IsString()
    state: string;

    @Column({ length: 11, nullable: false })
    @MaxLength(11)
    @MinLength(11)
    @IsNotEmpty()
    @IsString()
    cep: string;
}


