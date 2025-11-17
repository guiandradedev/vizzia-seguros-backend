import { User } from "src/user/users/entities/user.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../enum/status.enum";

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

    @Column({enum: Status, type: 'enum',  default: Status.Pending})
    status: Status

    @Column({type: 'float'})
    estimated_price: number;

    @CreateDateColumn({})
    created_at: Date;
}
