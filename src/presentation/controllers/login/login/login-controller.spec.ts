import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { MissingParamError } from '../../../error/missing-param-error'
import { ServerError } from '../../../error/server-error'
import { badResquest, ok, serverError, unauthorized } from '../../../helpers/http/http-helper'
import { Validation } from '../../../protocols/validation'
import { HttpRequest } from '../../../protocols/http-request'
import { LoginController } from './login-controller'
import { mockAuthentication, mockValidation } from '@/presentation/test'

type SutTypes = {
    sut: LoginController
    authenticationStub: Authentication
    validationStub: Validation
}

const mockRequest = (): HttpRequest => ({
    body: {
        email: 'any_email',
        password: 'any_password'
    }
})

const makeAuthenticationParams = (): AuthenticationParams => (
    { email: 'any_email', password: 'any_password' }
)

const makeSut = (): SutTypes => {
    const validationStub = mockValidation()
    const authenticationStub = mockAuthentication()
    const sut = new LoginController(authenticationStub, validationStub)
    return {
        sut,
        authenticationStub,
        validationStub
    }
}

describe('Login Controller', () => {
    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenCalledWith(makeAuthenticationParams())
    })

    test('Should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(unauthorized())
    })

    test('Should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })

    test('Should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validationStubpy = jest.spyOn(validationStub, 'validate')
        const httpeRequest = mockRequest()
        await sut.handle(httpeRequest)
        expect(validationStubpy).toHaveBeenCalledWith(httpeRequest.body)
    })

    test('Should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError(''))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badResquest(new MissingParamError('')))
    })
})
