import { MissingParamError } from '../../error/missing-param-error'
import { badResquest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols/http-request'
import { LoginController } from './login'

interface SutTypes {
    sut: LoginController
}

const makeSut = (): SutTypes => {
    const sut = new LoginController()
    return {
        sut
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
})
