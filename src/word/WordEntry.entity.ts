import { Expose } from 'class-transformer';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import WordSessionEntry from '../word-session/WordSessionEntry.entity';

@Entity()
export class WordEntry {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column()
  @Index({ })
  word: string;

  @Expose()
  @Column()
  position: string;

  @Expose()
  @Column({ nullable: true })
  gender: string;

  @Expose()
  @Column({ nullable: true })
  plural: string;

  @Expose()
  @Column({
    type: 'jsonb',
    array: false,
    default: () => '\'[]\'',
    nullable: false
  })
  conjugations: Conjugation[];

  @Expose()
  @Column({
    type: 'jsonb',
    array: false,
    default: () => '\'[]\'',
    nullable: false
  })
  senses: Sense[];

  @Expose()
  @Column({ nullable: true })
  formOf?: string;

  @OneToMany(() => WordSessionEntry, sessionEntry => sessionEntry.word)
  sessionEntries: WordSessionEntry[];
}

export type Conjugation = {
  form: string,
  tags: Array<string>
};

export type Sense = {
  meaning: string,
  examples: { text: string, translation: string }[]
};

export type WordMeta = {
  gender: string,
  plural: string
};
