import { Hasher } from '@/data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'

export class BcriptyAdapter implements Hasher, HashComparer {
    constructor(private readonly salt: number) { }

    async hash(value: string): Promise<string> {
        const result = await bcrypt.hash(value, this.salt)
        return result
    }

    async compare(value: string, hash: string): Promise<boolean> {
        const result = await bcrypt.compare(value, hash)
        return result
    }
}