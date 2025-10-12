import { IsString } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('vehicle')
export class Vehicle {

    @PrimaryGeneratedColumn({name: 'id_vehicle', type: 'int'})
    id: number;

    @Column()
    @IsString()
    plate: string;
    
    @Column()
    @IsString()
    model: string;
    
    @Column()
    @IsString()
    color: string;
    
    @Column()
    year: number;
    
    @Column()
    @IsString()
    odometer: string;
    
    @Column()
    @IsString()
    brand: string;
    
    id_user: number;

    userId: User;
}
