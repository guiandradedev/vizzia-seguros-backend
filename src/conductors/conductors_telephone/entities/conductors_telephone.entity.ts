import { Conductor } from "src/conductors/conductor/entities/conductor.entity";
import { Telephone } from "src/telephone/entities/telephone.entity";
import { Entity, ForeignKey, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('conductor_telephone')
export class ConductorsTelephone {

    @PrimaryColumn({ name: 'id_conductor', type: 'int' })
    id_conductor: number;

    @PrimaryColumn({ name: 'id_telephone', type: 'int' })
    id_telephone: number;

    @OneToOne(() => Conductor, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_conductor' })
    conductorId: Conductor;

    @OneToOne(() => Telephone, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_telephone' })
    telephoneId: Telephone;
}
