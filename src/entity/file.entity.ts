/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { uuid } from 'uuidv4';
import User from './user.entity';

export interface ICreateConversationDTO extends Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'> {}

@Entity()
export default class Conversation {
  @PrimaryColumn()
  public readonly id!: string;

  @ManyToOne(() => User)
  public user!: User;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  public constructor(
    props: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
