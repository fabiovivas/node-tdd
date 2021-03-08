import { AccountModel } from '@/domain/model/account-model'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { Hasher } from '../../protocols/cryptography/hasher'
import { DbAddAccount } from './db-add-account'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-email-by-repository'

interface SutTypes {
    sut: DbAddAccount
    HasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            return Promise.resolve('hashed_value')
        }
    }
    return new HasherStub()
}

const makeFakeAccountModel = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_value'
})

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccountModel())
        }
    }
    return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<AccountModel> {
            return null
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
    const HasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAddAccount(HasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
    return {
        sut,
        HasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    }
}

describe('DbAddAccount UseCase', () => {
    test('Should call Hasher with correct password', async () => {
        const { sut, HasherStub } = makeSut()
        const hashSpy = jest.spyOn(HasherStub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(hashSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw if Hasher throws', async () => {
        const { sut, HasherStub } = makeSut()
        jest.spyOn(HasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_value'
        })
    })

    test('Should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    test('Should return an account on success', async () => {
        const { sut } = makeSut()
        const result = await sut.add(makeFakeAccountData())
        expect(result).toEqual(makeFakeAccountModel())
    })

    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(makeFakeAccountData())
        expect(loadSpy).toHaveBeenCalledWith('valid_email')
    })

    test('Should return null if LoadAccountByEmailRepository not returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(makeFakeAccountModel())
        const result = await sut.add(makeFakeAccountData())
        expect(result).toBeNull()
    })

    test('Should throws if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValue(new Error())
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })
})
