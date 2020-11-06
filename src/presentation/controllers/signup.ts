import { MissingParamError } from '../error/missing-param-error'
import { badResquest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/httpRequest'

export class SignUpController {
    handle(httpeRequest: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email']
        for (const field of requiredFields) {
            if (!httpeRequest.body[field]) {
                return badResquest(new MissingParamError(field))
            }
        }
    }
}