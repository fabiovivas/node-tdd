import { MissingParamError } from '../../error/missing-param-error'
import { badResquest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols/http-request'
import { LoginController } from './login'

describe('Login Controller', () => {
    test('Should return 400 if no email is no provided', async () => {
        const sut = new LoginController()
        const httpRequest: HttpRequest = {
            body: {
                password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badResquest(new MissingParamError('email')))
    })
})
