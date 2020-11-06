import { MissingParamError } from '../error/missing-param-error'
import { badResquest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http-request'
import { Controller } from '../protocols/controller'

export class SignUpController implements Controller {
    handle(httpeRequest: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of requiredFields) {
            if (!httpeRequest.body[field]) {
                return badResquest(new MissingParamError(field))
            }
        }
    }
}