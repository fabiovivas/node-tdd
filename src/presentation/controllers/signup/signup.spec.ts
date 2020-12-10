import { AccountModel } from '../../../domain/model/account-model'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { MissingParamError } from '../../error/missing-param-error'
import { ServerError } from '../../error/server-error'
import { badResquest, ok, serverError } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'
import { SignUpController } from './signup'

interface SutTypes {
    sut: SignUpController
    addAccountStub: AddAccount
    validationStub: Validation
}

const makeAddAccountStub = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccount())
        }
    }

    return new AddAccountStub()
}

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }

    return new ValidationStub()
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

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccountStub()
    const validationStub = makeValidationStub()
    const sut = new SignUpController(addAccountStub, validationStub)
    return {
        sut,
        addAccountStub,
        validationStub
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

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
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
})
