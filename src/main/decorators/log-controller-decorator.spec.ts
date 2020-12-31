import { LogErrorRepository } from '../../data/protocols/db/log/log-repository'
import { AccountModel } from '../../domain/model/account-model'
import { ok, serverError } from '../../presentation/helpers/http/http-helper'
import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http-request'
import { LogControllerDecorator } from './log-controller-decorator'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError(stack: string): Promise<void> {
            return Promise.resolve(null)
        }
    }
    return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
            return Promise.resolve(ok(makeFakeAccount()))
        }
    }
    const controllerStub = new ControllerStub()
    return controllerStub
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

const makeFakeServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError)
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

describe('LogController Decorator', () => {
    test('Should call controller handle', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        await sut.handle(makeHttpeRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeHttpeRequest())
    })

    test('Should return the same result of controller', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeHttpeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
        await sut.handle(makeHttpeRequest())
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
