import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { WordEntry } from '../word/WordEntry.entity';
import WordSession from './WordSession.entity';

@Entity()
export default class WordSessionEntry {
  @Exclude()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Exclude()
  @Column()
  sessionId: string;

  @Exclude()
  @JoinColumn({ name: 'session_id' })
  @Type(() => WordSession)
  @ManyToOne(() => WordSession, session => session.entries, { onDelete: 'CASCADE' })
  wordSession: WordSession;

  @Column()
  word: string;
}
