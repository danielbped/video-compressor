/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { uuid } from 'uuidv4';
import User from './user.entity';
import { File as MulterFile } from 'multer';

export interface ICreateFileDTO {
  file: MulterFile;
  user: User;
}

@Entity()
export default class File {
  @PrimaryColumn()
  public readonly id!: string;

  @ManyToOne(() => User)
  public user!: User;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @Column()
  public readonly url!: string;

  @Column()
  public readonly path!: string;

  @Column()
  public readonly filename!: string;

  public constructor(
    props: Omit<File, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
