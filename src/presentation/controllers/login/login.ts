import { Authentication } from '../../../domain/usecases/authentication'
import { badResquest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'

export class LoginController implements Controller {
    private readonly validation: Validation
    private readonly authentication: Authentication
    constructor(authentication: Authentication, validation: Validation) {
        this.validation = validation
        this.authentication = authentication
    }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { email, password } = httpeRequest.body
            const error = this.validation.validate(httpeRequest.body)
            if (error) return badResquest(error)

            const accessToken = await this.authentication.auth(email, password)
            if (!accessToken) return unauthorized()

            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}