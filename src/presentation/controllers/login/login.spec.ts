import { InvalidParamError } from '../../error/invalid-param-error'
import { MissingParamError } from '../../error/missing-param-error'
import { ServerError } from '../../error/server-error'
import { badResquest, serverError } from '../../helpers/http-helper'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest } from '../../protocols/http-request'
import { LoginController } from './login'

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email',
        password: 'any_password'
    }
})

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: String): Boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

describe('Login Controller', () => {
    test('Should return 400 if no email is no provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        delete httpRequest.body.email
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new MissingParamError('email')))
    })

    test('Should return 400 if invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const httpRequest = makeFakeRequest()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new InvalidParamError('email')))
    })

    test('Should return 400 if no password is no provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        delete httpRequest.body.password
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new MissingParamError('password')))
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email) => { throw new Error() })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Should call EmailValidator with correct values', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const httpRequest = makeFakeRequest()
        const validateSpy = jest.spyOn(emailValidatorStub, 'isValid')
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith('any_email')
    })
})
