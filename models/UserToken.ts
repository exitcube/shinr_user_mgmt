import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, Generated } from 'typeorm';
import { User } from './User';
import { UserDevice } from './UserDevice';



@Entity('userToken')
export class UserToken {
    @PrimaryGeneratedColumn()
    id: number; // internal auto-increment id (good for sorting)

    @Column()
    @Generated('uuid')
    uuid: string; // external unique identifier (safe for exposure)

    @Column({ name: 'userId' })
    @Index()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ name: 'deviceId', nullable: false })
    @Index()
    deviceId: number;

    // @ManyToOne(() => UserDevice, { nullable: false })
    // @JoinColumn({ name: 'deviceId' })
    // device: UserDevice;

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
