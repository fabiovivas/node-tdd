import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-email-by-repository'

export class DbAuthentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        await this.loadAccountByEmailRepository.load(authentication.email)
        return null
    }
}