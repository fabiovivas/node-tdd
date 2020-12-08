import { InvalidParamError } from '../../error/invalid-param-error'
import { MissingParamError } from '../../error/missing-param-error'
import { badResquest } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        if (!httpeRequest.body.email) {
            return badResquest(new MissingParamError('email'))
        }

        if (!httpeRequest.body.password) {
            return badResquest(new MissingParamError('password'))
        }

        const isValid = this.emailValidator.isValid(httpeRequest.body.email)
        if (!isValid) return badResquest(new InvalidParamError('email'))
    }
}