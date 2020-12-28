import { Hasher } from '../../data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'

export class BcriptyAdapter implements Hasher {
    private readonly salt: number
    constructor(salt: number) {
        this.salt = salt
    }

    async hash(value: string): Promise<string> {
        const result = await bcrypt.hash(value, this.salt)
        return result
    }
}