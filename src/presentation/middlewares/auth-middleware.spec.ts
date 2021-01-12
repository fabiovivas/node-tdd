import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../error/access-denied-error'
import { AccountModel } from '../../domain/model/account-model'
import { HttpRequest } from '../protocols/http-request'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

const makeRequestFake = (): HttpRequest => ({
    headers: {
        'x-access-token': 'any_token'
    }
})

const makeAccountModelFake = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load(accessToken: string): Promise<AccountModel> {
            return makeAccountModelFake()
        }
    }
    return new LoadAccountByTokenStub()
}

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    return {
        sut,
        loadAccountByTokenStub
    }
}

describe('Auth Middleware', () => {
    test('Should return 403 if x-access-token no exists in headers', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should calls LoadAccountByToken with correct token', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        await sut.handle(makeRequestFake())
        expect(loadSpy).toHaveBeenCalledWith('any_token')
    })
})
