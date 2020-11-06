import { MissingParamError } from '../error/missing-param-error'
import { badResquest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/httpRequest'

export class SignUpController {
    handle(httpeRequest: HttpRequest): HttpResponse {
        if (!httpeRequest.body.name) {
            return badResquest(new MissingParamError('name'))
        }

        if (!httpeRequest.body.email) {
            return badResquest(new MissingParamError('email'))
        }
    }
}