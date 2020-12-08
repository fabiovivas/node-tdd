import { MissingParamError } from '../../error/missing-param-error'
import { badResquest } from '../../helpers/http-helper'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest } from '../../protocols/http-request'
import { LoginController } from './login'

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
}

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
        const httpRequest: HttpRequest = {
            body: {
                password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is no provided', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                email: 'any_email'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new MissingParamError('password')))
    })

    test('Should call EmailValidator with correct values', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                email: 'any_email',
                password: 'any_password'
            }
        }
        const validateSpy = jest.spyOn(emailValidatorStub, 'isValid')
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith('any_email')
    })
})
