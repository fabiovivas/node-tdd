import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../error/access-denied-error'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http-request'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
    constructor(private readonly loadAccountByToken: LoadAccountByToken) { }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        const token = httpeRequest.headers?.['x-access-token']
        if (token) {
            await this.loadAccountByToken.load(token)
        }
        return forbidden(new AccessDeniedError())
    }
}