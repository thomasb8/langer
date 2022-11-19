import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import WordSession from '../word-session/WordSession.entity';

@Entity()
export default class User {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column()
  firstName: string;

  @Expose()
  @Column()
  lastName: string;

  @Expose()
  @Column()
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  passwordHash: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => WordSession, session => session.user)
  sessions: WordSession[];
}
