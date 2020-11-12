import { MissingParamError } from '../error/missing-param-error'
import { badResquest, ok, serverError } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http-request'
import { Controller } from '../protocols/controller'
import { InvalidParamError } from '../error/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { AddAccount } from '../../domain/usecases/add-account'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }

    handle(httpeRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpeRequest.body[field]) {
                    return badResquest(new MissingParamError(field))
                }
            }

            const { name, email, password, passwordConfirmation } = httpeRequest.body
            if (password !== passwordConfirmation) {
                return badResquest(new InvalidParamError('passwordConfirmation'))
            }

            const isValid: Boolean = this.emailValidator.isValid(email)
            if (!isValid) {
                return badResquest(new InvalidParamError('email'))
            }
            const account = this.addAccount.add({
                name,
                email,
                password
            })
            return ok(account)
        } catch (error) {
            return serverError()
        }
    }
}