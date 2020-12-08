import { MissingParamError } from '../../error/missing-param-error'
import { badResquest } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'

export class LoginController implements Controller {
    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        return badResquest(new MissingParamError('email'))
    }
}