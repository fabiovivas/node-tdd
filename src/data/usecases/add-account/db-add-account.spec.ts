import { AccountModel } from '../../../domain/model/account-model'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { Hasher } from '../../protocols/cryptography/hasher'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
    sut: DbAddAccount
    HasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
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

const makeSut = (): SutTypes => {
    const HasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(HasherStub, addAccountRepositoryStub)
    return {
        sut,
        HasherStub,
        addAccountRepositoryStub
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
})
