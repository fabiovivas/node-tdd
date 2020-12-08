import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError } from '../../error/invalid-param-error'
import { MissingParamError } from '../../error/missing-param-error'
import { badResquest, serverError } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication
    constructor(emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { email, password } = httpeRequest.body
            if (!email) {
                return badResquest(new MissingParamError('email'))
            }

            if (!password) {
                return badResquest(new MissingParamError('password'))
            }

            const isValid = this.emailValidator.isValid(email)
            if (!isValid) return badResquest(new InvalidParamError('email'))

            await this.authentication.auth(email, password)
        } catch (error) {
            return serverError(error)
        }
    }
}