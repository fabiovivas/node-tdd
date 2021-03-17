import { Authentication } from '@/domain/usecases/account/authentication'
import { badResquest, ok, serverError, unauthorized } from '../../../helpers/http/http-helper'
import { Validation } from '../../../protocols/validation'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http-request'

export class LoginController implements Controller {
    constructor(
        private readonly authentication: Authentication,
        private readonly validation: Validation
    ) { }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { email, password } = httpeRequest.body
            const error = this.validation.validate(httpeRequest.body)
            if (error) return badResquest(error)

            const accessToken = await this.authentication.auth({ email, password })
            if (!accessToken) return unauthorized()

            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}