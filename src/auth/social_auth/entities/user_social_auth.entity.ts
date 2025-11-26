import { User } from "src/user/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('user_social_auth')
export class UserSocialAuth {
    @Column({name: 'provider', type: 'varchar', length: 100})
    provider: string;

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @PrimaryColumn({name: 'id_provider', type: 'varchar', length: 100, nullable: false, unique: true})
    id_provider: string;

    @PrimaryColumn({name: 'id_user', type: 'int', unique: true, nullable: false})
    id_user: number;

    @OneToOne(() => User, user => user.id, {eager: true, nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_user', referencedColumnName: 'id'})
    userId: User;
}