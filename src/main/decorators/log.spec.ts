import { LogErrorRepository } from '../../data/protocols/log-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http-request'
import { LogControllerDecorator } from './log'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(stack: string): Promise<void> {
            return Promise.resolve(null)
        }
    }
    return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: { name: 'Fabio' }
            }
            return Promise.resolve(httpResponse)
        }
    }
    const controllerStub = new ControllerStub()
    return controllerStub
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
        const httpeRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpeRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpeRequest)
    })

    test('Should return the same result of controller', async () => {
        const { sut } = makeSut()
        const httpeRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpeRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: { name: 'Fabio' }
        })
    })

    test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const resolve = serverError(fakeError)
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(resolve))
        const httpeRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpeRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
