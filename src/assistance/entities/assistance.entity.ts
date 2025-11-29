import { Insurance } from "src/insurance/entities/insurance.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AssistanceType, AssistanceStatus } from "../enum/assistance-type.enum";

@Entity()
export class Assistance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: AssistanceType })
    type: AssistanceType;

    @Column({ type: 'enum', enum: AssistanceStatus, default: AssistanceStatus.PENDING })
    status: AssistanceStatus;

    @Column({ type: 'text' , nullable: true})
    description?: string;

    @Column({ type: 'varchar', nullable: true })
    location?: string;

    @Column({ type: 'float' })
    cost_value: number;

    @CreateDateColumn()
    requested_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    completed_at: Date;

    @ManyToOne(() => Insurance, { nullable: false })
    @JoinColumn({ name: 'insurance_id' })
    insurance: Insurance;
}
