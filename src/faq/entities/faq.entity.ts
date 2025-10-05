import {Entity, PrimaryGeneratedColumn, Column } from "typeorm"


@Entity('faqs')
export class Faq {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'varchar', length: 255})
    question: string;

    @Column({type: 'text'})
    answer: string;

    @Column({type: 'boolean', default: true})
    isActive: boolean;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: `timestamp`, default: () => 'CURRENT_TIMESTANP'})
    updatedAt: Date;


}


