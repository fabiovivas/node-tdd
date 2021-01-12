import { AccountModel } from '../../../domain/model/account-model'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor(private readonly decrypter: Decrypter) { }

    async load(accessToken: string, role?: string): Promise<AccountModel> {
        await this.decrypter.decrypt(accessToken)
        return null
    }
}