import { MissingParamError } from '../../error/missing-param-error'
import { badResquest } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'

export class LoginController implements Controller {
    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        if (!httpeRequest.body.email) {
            return badResquest(new MissingParamError('email'))
        }

        if (!httpeRequest.body.password) {
            return badResquest(new MissingParamError('password'))
        }
    }
}