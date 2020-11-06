import { HttpRequest, HttpResponse } from '../protocols/httpRequest'

export class SignUpController {
    handle(httpeRequest: HttpRequest): HttpResponse {
        if (!httpeRequest.body.name) {
            return {
                statusCode: 400,
                body: new Error('Missing param: name')
            }
        }

        if (!httpeRequest.body.email) {
            return {
                statusCode: 400,
                body: new Error('Missing param: email')
            }
        }
    }
}