import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PasswordHasher } from '../../application/password-hasher.interface';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async compare(plain: string, hash: string, ): Promise<boolean> {
        return await bcrypt.compare(plain, hash);
    }
}