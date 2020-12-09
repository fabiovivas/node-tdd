import { InvalidParamError } from '../../error/invalid-param-error'
import { ServerError } from '../../error/server-error'
import { EmailValidator } from '../../protocols/email-validator'
import { EmailValidation } from './email-validation'

interface SutTypes {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: String): Boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidatorStub()
    const sut = new EmailValidation('email', emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

describe('Email Validation', () => {
    test('Should return an error if EmailValidator returns false', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const error = sut.validate({ email: 'any_email' })
        expect(error).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        sut.validate({ email: 'any_email' })
        expect(isValidSpy).toHaveBeenCalledWith('any_email')
    })

    test('Should throw if EmailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new ServerError()
        })
        expect(sut.validate).toThrow()
    })
})
