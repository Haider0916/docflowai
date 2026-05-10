import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FileStatusEnum {
    UPLOADED = 'UPLOADED',
    QUEUED = 'QUEUED',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar', length: 500 })
    filename!: string;

    @Column({ type: 'varchar', length: 500 })
    filepath!: string;

    @Column({ type: 'text', nullable: true })
    errormsg!: string | null;

    @Column({ type: 'enum', enum: FileStatusEnum, default: FileStatusEnum.UPLOADED })
    fileStatus!: FileStatusEnum;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}