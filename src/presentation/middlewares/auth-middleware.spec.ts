import { AuthMiddleware } from './auth-middleware'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../error/access-denied-error'
import { HttpRequest } from '../protocols/http-request'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { mockLoadAccountByToken } from '@/presentation/test'

const makeRequestFake = (): HttpRequest => ({
    headers: {
        'x-access-token': 'valid_token'
    }
})

type SutTypes = {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = mockLoadAccountByToken()
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
        const role = 'valid_role'
        const { sut, loadAccountByTokenStub } = makeSut(role)
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        await sut.handle(makeRequestFake())
        expect(loadSpy).toHaveBeenCalledWith('valid_token', role)
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
        expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
    })

    test('Should returns 500 if LoadAccount throws', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())
        const httpResponse = await sut.handle(makeRequestFake())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
