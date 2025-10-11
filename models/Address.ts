 
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn
} from 'typeorm';

import { User } from './User';

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'userId' })
    @Index()
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({nullable: true})
    name: string;

    @Column({length: 255 })
    addressLine1: string;

    @Column({length: 100 })
    country: string;

    @Column({length: 100 })
    city: string;

    @Column({ length: 100 })
    state: string;

    @Column({length: 20 })
    pinCode: string;

    @Column({ type: 'decimal', precision: 10, scale: 5, nullable: false })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 5, nullable: false })
    longitude: number;

    @Column({ default: false })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
