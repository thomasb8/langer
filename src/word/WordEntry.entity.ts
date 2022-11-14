import { Expose } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column({
    type: 'jsonb',
    array: false,
    nullable: true
  })
  formOf?: RelatedWord[];
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

export type RelatedWord = {
  word: string;
  id: string;
};
