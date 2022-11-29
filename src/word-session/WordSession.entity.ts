import { Exclude, Expose, Type } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import WordSessionEntry from './WordSessionEntry.entity';
import User from '../user/User.entity';

@Entity()
export default class WordSession {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @Column()
  userId: string;

  @Exclude()
  @JoinColumn({ name: 'user_id' })
  @Type(() => User)
  @ManyToOne(() => User, user => user.sessions, { onDelete: 'CASCADE' })
  user: User;

  @Expose()
  @Type(() => WordSessionEntry)
  @OneToMany(() => WordSessionEntry, entry => entry.wordSession, { cascade: true, onDelete: 'CASCADE' })
  entries: WordSessionEntry[];
}
