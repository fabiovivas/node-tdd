import { MissingParamError } from '../error/missing-param-error'
import { HttpRequest, HttpResponse } from '../protocols/httpRequest'

export class SignUpController {
    handle(httpeRequest: HttpRequest): HttpResponse {
        if (!httpeRequest.body.name) {
            return {
                statusCode: 400,
                body: new MissingParamError('name')
            }
        }

        if (!httpeRequest.body.email) {
            return {
                statusCode: 400,
                body: new MissingParamError('email')
            }
        }
    }
}