import { AccountModel } from '../../../domain/model/account-model'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

const makeDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        async decrypt(value: string): Promise<string> {
            return 'any_value'
        }
    }
    return new DecrypterStub()
}

const makeAccountModelFake = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
})

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
        async loadByToken(accessToken: string): Promise<AccountModel> {
            return makeAccountModelFake()
        }
    }
    return new LoadAccountByTokenRepositoryStub()
}

interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByEmailRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypter()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByTokenRepository()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByEmailRepositoryStub)
    return {
        sut,
        decrypterStub,
        loadAccountByEmailRepositoryStub
    }
}

describe('DbLoadAccountByToken Usecase', () => {
    test('Should calls Decrypter with correct token', async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token', 'any_role')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    })

    test('Should return null if Decrypter returns null', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    })

    test('Should calls LoadAccountByTokenRepository with correct values', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadByTokenSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByToken')
        await sut.load('any_token', 'any_role')
        expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
    })

    test('Should return null if LoadAccountByTokenRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    })

    test('Should return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.load('any_token', 'any_role')
        expect(account).toEqual(makeAccountModelFake())
    })

    test('Should throws if Decrypter throws', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
        const promise = sut.load('any_token', 'any_role')
        await expect(promise).rejects.toThrow()
    })
})
