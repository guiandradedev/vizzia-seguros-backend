import { HashingServiceProtocol } from "./hashing.service";
import * as bcrypt from 'bcrypt';

export class BcryptService extends HashingServiceProtocol{
    async hash(data: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(data, salt);
    }

    async compare(data: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(data, passwordHash);
    }
}