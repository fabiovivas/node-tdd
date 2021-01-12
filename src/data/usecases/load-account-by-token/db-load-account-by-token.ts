import { AccountModel } from '../../../domain/model/account-model'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountByToken: LoadAccountByTokenRepository
    ) { }

    async load(accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)
        if (token) {
            return await this.loadAccountByToken.loadByToken(accessToken, role)
        }
        return null
    }
}