import { Injectable } from '@nestjs/common';
import { IdGenerator } from '../../interfaces/id-generator.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UuidIdGenerator implements IdGenerator {
    generate(): string {
        return uuidv4();
    }
}