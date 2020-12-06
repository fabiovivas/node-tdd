import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http-request'
import { LogControllerDecorator } from './log'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
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
    const sut = new LogControllerDecorator(controllerStub)
    return {
        sut,
        controllerStub
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
})
