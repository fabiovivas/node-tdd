import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-email-by-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    private readonly tokenGenerator: TokenGenerator
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    constructor(
        loadAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        tokenGenerator: TokenGenerator,
        updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashComparer = hashComparer
        this.tokenGenerator = tokenGenerator
        this.updateAccessTokenRepository = updateAccessTokenRepository
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        let accessToken = null
        let validatePassword = false

        const account = await this.loadAccountByEmailRepository.load(authentication.email)
        if (account) {
            validatePassword = await this.hashComparer.compare(authentication.password, account.password)
        }
        if (validatePassword) {
            accessToken = await this.tokenGenerator.generate(account.id)
        }
        if (accessToken) {
            await this.updateAccessTokenRepository.update(account.id, accessToken)
        }

        return accessToken
    }
}