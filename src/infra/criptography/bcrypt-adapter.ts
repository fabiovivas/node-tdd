import { Hasher } from '../../data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../data/protocols/cryptography/hash-comparer'

export class BcriptyAdapter implements Hasher, HashComparer {
    private readonly salt: number
    constructor(salt: number) {
        this.salt = salt
    }

    async hash(value: string): Promise<string> {
        const result = await bcrypt.hash(value, this.salt)
        return result
    }

    async compare(value: string, hash: string): Promise<boolean> {
        await bcrypt.compare(value, hash)
        return null
    }
}