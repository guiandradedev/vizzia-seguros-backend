import { IsString, Max, Min } from "class-validator";
import { User } from "src/user/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { VehicleImage } from "./vehicle-image.entity";
import { MotorizationType } from "../enums/motorization-types.enum";

@Entity('vehicle')
export class Vehicle {

    @PrimaryGeneratedColumn({name: 'id_vehicle', type: 'int'})
    id: number;

    @Column({length: 7, unique: true, type: 'varchar'})
    @IsString()
    plate: string;
    
    @Column({length: 100, type: 'varchar'})
    @IsString()
    model: string;
    
    @Column({length: 10, type: 'varchar'})
    @IsString()
    color: string;
    
    @Column({type: 'int'})
    year: number;
    
    @Column({type: 'varchar'})
    @IsString()
    odometer: string;
    
    @Column({length: 10, type: 'varchar'})
    @IsString()
    brand: string;

    @Column({
        type: 'enum',
        enum: MotorizationType,
        nullable: false,
    })
    @IsString()
    motorization: string;

    @Column({type: 'int', default: 1})
    @Max(3)
    @Min(1)
    state: number;
    
    @ManyToOne(() => User, {onDelete: 'CASCADE', eager: true, nullable: false})
    @JoinColumn({name: 'id_user'})
    userId: User;

    @OneToMany(() => VehicleImage, (image) => image.vehicle)
    images: VehicleImage[];
}
