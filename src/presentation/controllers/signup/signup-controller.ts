import { AddAccount } from '../../../domain/usecases/add-account'
import { badResquest, ok, serverError } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'
import { Authentication } from '../../../domain/usecases/authentication'

export class SignUpController implements Controller {
    constructor(
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) { }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpeRequest.body)
            if (error) return badResquest(error)

            const { name, email, password } = httpeRequest.body
            await this.addAccount.add({
                name,
                email,
                password
            })
            const accessToken = await this.authentication.auth({ email, password })
            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}