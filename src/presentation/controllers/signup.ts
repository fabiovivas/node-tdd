import { MissingParamError } from '../error/missing-param-error'
import { badResquest, serverError } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http-request'
import { Controller } from '../protocols/controller'
import { InvalidParamError } from '../error/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpeRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpeRequest.body[field]) {
                    return badResquest(new MissingParamError(field))
                }
            }

            if (httpeRequest.body.password !== httpeRequest.body.passwordConfirmation) {
                return badResquest(new InvalidParamError('passwordConfirmation'))
            }

            const isValid: Boolean = this.emailValidator.isValid(httpeRequest.body.email)
            if (!isValid) {
                return badResquest(new InvalidParamError('email'))
            }
        } catch (error) {
            return serverError()
        }
    }
}