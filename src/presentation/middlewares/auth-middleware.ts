import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AccessDeniedError } from '../error/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http-request'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
    constructor(
        private readonly loadAccountByToken: LoadAccountByToken,
        private readonly role?: string
    ) { }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const token = httpeRequest.headers?.['x-access-token']
            if (token) {
                const account = await this.loadAccountByToken.load(token, this.role)
                if (account) return ok({ accountId: account.id })
            }
            return forbidden(new AccessDeniedError())
        } catch (error) {
            return serverError(error)
        }
    }
}