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

  @Exclude()
  @Column()
  wordId: string;

  @JoinColumn({ name: 'word_id' })
  @Type(() => WordEntry)
  @ManyToOne(() => WordEntry, wordEntry => wordEntry.sessionEntries, { onDelete: 'CASCADE' })
  word: WordEntry;
}
