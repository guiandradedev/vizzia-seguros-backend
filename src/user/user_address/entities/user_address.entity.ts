import { User } from "src/user/users/entities/user.entity";
import { Address } from "src/address/entities/address.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('user-address')
export class UserAddress {
    @PrimaryColumn({ name: 'id_user', type: 'int' })
    id_user: number;

    @PrimaryColumn({ name: 'id_address', type: 'int' })
    id_address: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @ManyToOne(() => Address, { onDelete: 'CASCADE', nullable: false, eager: true })
    @JoinColumn({ name: 'id_address' })
    address: Address;
}