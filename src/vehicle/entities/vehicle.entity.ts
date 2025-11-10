import { IsString, Max, Min } from "class-validator";
import { User } from "src/user/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { VehicleImage } from "./vehicle-image.entity";
import { MotorizationType } from "../enums/motorization-types.enum";
import { TransmissionType } from "../enums/transmission-type.enum";
import { VehicleUseType } from "../enums/vehicle_use-types.enum";
import { Brands } from "../enums/brand.enum";

@Entity('vehicle')
export class Vehicle {

    @PrimaryGeneratedColumn({name: 'id_vehicle', type: 'int'})
    id: number;

    @Column({length: 8, unique: true, type: 'varchar'})
    @IsString()
    plate: string;
    
    @Column({length: 100, type: 'varchar'})
    @IsString()
    model: string;
    
    @Column({length: 100, type: 'varchar'})
    @IsString()
    color: string;
    
    @Column({type: 'int'})
    year: number;
    
    @Column({type: 'varchar'})
    @IsString()
    odometer: string;
    
    @Column({enum: Brands, type: 'enum'})
    brand: Brands;

    @Column({
        type: 'enum',
        enum: MotorizationType,
        nullable: false,
    })
    @IsString()
    motorization: string;

    @Column({
        type: 'enum',
        enum: TransmissionType,
        nullable: false
    })
    transmission: TransmissionType;

    @Column({
        type: 'enum',
        enum: VehicleUseType,
        nullable: false
    })
    use_type: VehicleUseType;

    @Column({type: 'int', default: 1})
    @Max(3)
    @Min(1)
    state: number;
    
    @ManyToOne(() => User, {onDelete: 'CASCADE', eager: true, nullable: false})
    @JoinColumn({name: 'id_user'})
    userId: User;

    @OneToMany(() => VehicleImage, (image) => image.vehicle)
    images: VehicleImage[];

    @Column({type: 'float'})
    fipe_moment: number;
}
