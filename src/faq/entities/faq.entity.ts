import {Entity, PrimaryGeratedColum, Colum } from "typeorm"


@Entity('faqs')
export class Faq {

    @PrimaryGeratedColum('uuid')
    id: string

    @Colum({type: 'varchar', lenght: 255})
    question: string;

    @Colum({type: 'text'})
    answer: string;

    @Colum({type: 'boolean', default: true})
    isActive: boolean;

    @Colum({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;


}

