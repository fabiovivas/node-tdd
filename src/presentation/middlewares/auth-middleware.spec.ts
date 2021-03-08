import { AuthMiddleware } from './auth-middleware'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../error/access-denied-error'
import { AccountModel } from '@/domain/model/account-model'
import { HttpRequest } from '../protocols/http-request'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'

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

type SutTypes = {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByTokenStub, role)
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
        const role = 'any_role'
        const { sut, loadAccountByTokenStub } = makeSut(role)
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        await sut.handle(makeRequestFake())
        expect(loadSpy).toHaveBeenCalledWith('any_token', role)
    })

    test('Should returns 403 if LoadAccount returns null', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
        const httpResponse = await sut.handle(makeRequestFake())
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should returns 200 if LoadAccount returns an account', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeRequestFake())
        expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
    })

    test('Should returns 500 if LoadAccount throws', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())
        const httpResponse = await sut.handle(makeRequestFake())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
