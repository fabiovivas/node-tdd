import { Decrypter } from '../../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../../protocols/db/account/load-account-by-token-repository'
import { mockAccountModel } from '@/domain/test'
import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test'

type SutTypes = {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByEmailRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
    const decrypterStub = mockDecrypter()
    const loadAccountByEmailRepositoryStub = mockLoadAccountByTokenRepository()
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
        expect(account).toEqual(mockAccountModel())
    })

    test('Should throws if Decrypter throws', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
        const promise = sut.load('any_token', 'any_role')
        await expect(promise).rejects.toThrow()
    })

    test('Should throws if LoadAccountByTokenRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())
        const promise = sut.load('any_token', 'any_role')
        await expect(promise).rejects.toThrow()
    })
})
