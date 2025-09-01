import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('userOtp')
export class UserOtp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'userId' })
    @Index()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    otp: string;

    @Column()
    otpToken: string;

    @Column({ type: 'timestamp' })
    lastRequestedTime: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'smallint', default: 0 })
    requestCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    
}
