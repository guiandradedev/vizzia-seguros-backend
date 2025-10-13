import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";

@Entity('vehicle_image')
export class VehicleImage {
    @PrimaryGeneratedColumn({ name: 'id_image' })
    id: number;

    @Column({ type: 'varchar', length: 255, comment: 'Caminho ou URL da imagem' })
    path: string;

    // Relacionamento: Muitas imagens pertencem a UM veículo.
    @ManyToOne(() => Vehicle, (vehicle) => vehicle.images, { 
        onDelete: 'CASCADE', // Se o veículo for deletado, suas imagens também serão.
        nullable: false 
    })
    @JoinColumn({ name: 'id_vehicle' }) // Define a coluna da chave estrangeira.
    vehicle: Vehicle;
}