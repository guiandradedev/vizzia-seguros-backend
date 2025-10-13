import { IsString } from "class-validator";
import { User } from "src/user/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { VehicleImage } from "./vehicle-image.entity";

@Entity('vehicle')
export class Vehicle {

    @PrimaryGeneratedColumn({name: 'id_vehicle', type: 'int'})
    id: number;

    @Column({length: 7, unique: true, type: 'varchar'})
    @IsString()
    plate: string;
    
    @Column({length: 10, type: 'varchar'})
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
    
    // @Column({name: 'id_user', type: 'int'})
    // id_user: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE', eager: true, nullable: false})
    @JoinColumn({name: 'id_user'})
    userId: User;

    @OneToMany(() => VehicleImage, (image) => image.vehicle)
    images: VehicleImage[];
}
