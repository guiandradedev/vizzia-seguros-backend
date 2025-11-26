import { Conductor } from "src/conductors/conductor/entities/conductor.entity";
import { Insurance } from "src/insurance/entities/insurance.entity";
import { User } from "src/user/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum EndorsementType {
    ADD_CONDUCTOR = 'ADD_CONDUCTOR',
    REMOVE_CONDUCTOR = 'REMOVE_CONDUCTOR',
    CHANGE_ADDRESS = 'CHANGE_ADDRESS',
}

export enum EndorsementStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity()
export class InsuranceEndorsement {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: EndorsementType })
    type: EndorsementType;

    @Column({ type: 'enum', enum: EndorsementStatus, default: EndorsementStatus.PENDING })
    status: EndorsementStatus;

    @Column({ type: 'float' })
    value_change: number;

    @ManyToOne(() => Insurance, (insurance) => insurance.endorsements)
    @JoinColumn({ name: 'insurance_id' })
    insurance: Insurance;

    @ManyToMany(() => Conductor, { nullable: false, eager: true })
    @JoinTable({
        name: 'insurance_endorsement_conductors',
        joinColumn: { name: 'endorsement_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'conductor_id', referencedColumnName: 'id' },
    })
    target_conductor: Conductor[];

    @ManyToOne(() => User, {eager: true})
    @JoinColumn({ name: 'related_user_id' })
    requested_by: User;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    processed_at: Date;
}
