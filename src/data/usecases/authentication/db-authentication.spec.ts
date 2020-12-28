import { AccountModel } from '../../../domain/model/account-model'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-email-by-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
            async load(email: string): Promise<AccountModel> {
                const account: AccountModel = {
                    id: 'any_id',
                    name: 'any_name',
                    email: 'any_email',
                    password: 'any_password'
                }
                return account
            }
        }
        const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
        const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        await sut.auth({ email: 'any_email', password: 'any_password' })
        expect(loadSpy).toHaveBeenCalledWith('any_email')
    })
})