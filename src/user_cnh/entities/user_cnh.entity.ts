import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { CnhImage } from "src/cnh-image/entities/cnh-image.entity";

@Entity('user-cnh')
export class UserCnh {
    @PrimaryColumn({ name: 'id_user', type: 'int' })
    id_user: number;

    @PrimaryColumn({ name: 'id_cnh', type: 'int' })
    id_cnh: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @ManyToOne(() => CnhImage, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_cnh' })
    cnh: CnhImage;
}
