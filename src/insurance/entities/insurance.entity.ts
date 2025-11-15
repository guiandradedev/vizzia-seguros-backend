import { User } from "src/user/users/entities/user.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Insurance {
    
    @PrimaryGeneratedColumn()
    id_insurance: number;

    @OneToOne(() => Vehicle, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'id_vehicle'})
    vehicle: Vehicle;

    @ManyToOne(() => User, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'id_user'})
    user: User;

    @Column({type: 'float'})
    estimated_price: number;

    @CreateDateColumn({})
    created_at: Date;
}
