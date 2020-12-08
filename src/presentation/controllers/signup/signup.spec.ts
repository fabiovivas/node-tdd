import { AccountModel } from '../../../domain/model/account-model'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { InvalidParamError } from '../../error/invalid-param-error'
import { MissingParamError } from '../../error/missing-param-error'
import { ServerError } from '../../error/server-error'
import { badResquest, ok, serverError } from '../../helpers/http-helper'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'
import { SignUpController } from './signup'

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}

const makeAddAccountStub = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccount())
        }
    }

    return new AddAccountStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeHttpeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

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
    const addAccountStub = makeAddAccountStub()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)
    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse: HttpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new MissingParamError('name')))
    })

    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse: HttpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse: HttpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new MissingParamError('password')))
    })

    test('Should return 400 if no password confirmation is provided', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse: HttpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new MissingParamError('passwordConfirmation')))
    })

    test('Should return 400 if no password confirmation fails', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        }
        const httpResponse: HttpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new InvalidParamError('passwordConfirmation')))
    })

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse: HttpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(badResquest(new InvalidParamError('email')))
    })

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        await sut.handle(makeHttpeRequest())
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse: HttpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        await sut.handle(makeHttpeRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        })
    })

    test('Should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return Promise.reject(new Error())
        })
        const httpResponse: HttpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })
})
