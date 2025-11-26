import { Telephone } from "src/telephone/entities/telephone.entity";
import { User } from "src/user/users/entities/user.entity";
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('user_telephone')
export class UserTelephone {

    @PrimaryColumn({ name: 'id_user', type: 'int' })
    id_user: number;

    @PrimaryColumn({ name: 'id_telephone', type: 'int' })
    id_telephone: number;

    @OneToOne(() => User, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_user' })
    userId: User;

    @OneToOne(() => Telephone, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_telephone' })
    telephoneId: Telephone;

}
