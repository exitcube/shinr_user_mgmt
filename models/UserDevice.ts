import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('userDevice')
export class UserDevice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'userId' })
    @Index()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'timestamp' })
    lastLogin: Date;

    @Column({ type: 'timestamp' })
    lastActive: Date;

    @Column()
    userAgent: string;

    @Column({ type: 'timestamp' })
    lastLogoutTime: Date;

    @Column()
    ipAddress: string;

    @Column({ default: true })
    isActive: boolean;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}




