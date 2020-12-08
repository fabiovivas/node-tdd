import { InvalidParamError } from '../../error/invalid-param-error'
import { MissingParamError } from '../../error/missing-param-error'
import { badResquest, serverError } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
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
        } catch (error) {
            return serverError(error)
        }
    }
}