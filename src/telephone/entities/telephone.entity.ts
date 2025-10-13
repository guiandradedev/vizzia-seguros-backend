import { IsNotEmpty, MaxLength, Min, MinLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum TelephoneType {
    COMERCIAL = 'comercial',
    PESSOAL = 'pessoal',
    FIXO = 'fixo'
}
@Entity('telephone')
export class Telephone {

    @PrimaryGeneratedColumn({name: 'id_telefone', type: 'int'})
    id: number;

    @Column({length: 11, nullable: false})
    @IsNotEmpty()
    phone_number: string;
    
    @Column({
        type: 'enum',
        enum: TelephoneType
    })
    type: TelephoneType;
}