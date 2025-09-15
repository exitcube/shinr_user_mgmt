import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { UserDevice } from './UserDevice';



@Entity('userToken')
export class UserToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'userId' })
    @Index()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ name: 'deviceId', nullable: true })
    @Index()
    deviceId: string;

    @ManyToOne(() => UserDevice, { nullable: true })
    @JoinColumn({ name: 'deviceId' })
    device: UserDevice | null;

    @Column({ type: 'text' })
    refreshToken: string;

    @Column({ unique: true })
    accessToken: string;

    @Column({ type: 'timestamp', nullable: true })
    refreshTokenExpiry: Date | null;

    @Column({ unique: true })
    refreshTokenStatus: string;

    @Column({ default: false })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
