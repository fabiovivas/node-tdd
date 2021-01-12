import { AccessDeniedError } from '../error/access-denied-error'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http-request'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        return forbidden(new AccessDeniedError())
    }
}