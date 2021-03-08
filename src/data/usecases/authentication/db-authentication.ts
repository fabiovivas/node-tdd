import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { Encrypter } from '../../protocols/cryptography/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-email-by-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository'

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly tokenGenerator: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ) { }

    async auth(authentication: AuthenticationModel): Promise<string> {
        let accessToken = null
        let validatePassword = false

        const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
        if (account) {
            validatePassword = await this.hashComparer.compare(authentication.password, account.password)
        }
        if (validatePassword) {
            accessToken = await this.tokenGenerator.encrypt(account.id)
        }
        if (accessToken) {
            await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        }

        return accessToken
    }
}