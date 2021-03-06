import { AddAccount } from '@/domain/usecases/account/add-account'
import { MissingParamError } from '../../../error/missing-param-error'
import { ServerError } from '../../../error/server-error'
import { EmailInUseError } from '../../../error/email-in-use-error'
import { badResquest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { Validation } from '../../../protocols/validation'
import { HttpRequest, HttpResponse } from '../../../protocols/http-request'
import { SignUpController } from './signup-controller'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { mockAddAccount, mockAuthentication, mockValidation } from '@/presentation/test'

type SutTypes = {
    sut: SignUpController
    addAccountStub: AddAccount
    validationStub: Validation
    authenticationStub: Authentication
}

const makeHttpeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

const makeAuthenticationParams = (): AuthenticationParams => (
    { email: 'any_email@mail.com', password: 'any_password' }
)

const makeSut = (): SutTypes => {
    const addAccountStub = mockAddAccount()
    const validationStub = mockValidation()
    const authenticationStub = mockAuthentication()
    const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return Promise.reject(new Error())
        })
        const httpResponse: HttpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Should return 403 if AddAccount returns null', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockResolvedValue(null)
        const httpResponse: HttpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
    })

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })

    test('Should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validationStubpy = jest.spyOn(validationStub, 'validate')
        const httpeRequest = makeHttpeRequest()
        await sut.handle(httpeRequest)
        expect(validationStubpy).toHaveBeenCalledWith(httpeRequest.body)
    })

    test('Should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError(''))
        const httpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(badResquest(new MissingParamError('')))
    })

    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeHttpeRequest())
        expect(authSpy).toHaveBeenCalledWith(makeAuthenticationParams())
    })

    test('Should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
        const httpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
})
