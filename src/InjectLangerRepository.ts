import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { InjectRepository } from '@nestjs/typeorm';

export const InjectLangerRepository = (entity: EntityClassOrSchema) => InjectRepository(entity, 'langer');
