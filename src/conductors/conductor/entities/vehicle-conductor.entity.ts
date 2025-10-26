import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, PrimaryColumn } from 'typeorm';
import { Conductor } from './conductor.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';

@Entity('vehicle_conductor')
export class VehicleConductor {
    @PrimaryColumn({ name: 'id_vehicle', type: 'int' })
    id_vehicle: number;

    @PrimaryColumn({ name: 'id_conductor', type: 'int' })
    id_conductor: number;

    @ManyToOne(() => Vehicle, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_vehicle' })
    vehicleId: Vehicle;
    
    @ManyToOne(() => Conductor, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_conductor' })
    conductorId: Conductor;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}