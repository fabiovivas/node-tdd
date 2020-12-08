import { AddAccount } from '../../../domain/usecases/add-account'
import { InvalidParamError } from '../../error/invalid-param-error'
import { MissingParamError } from '../../error/missing-param-error'
import { badResquest, ok, serverError } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
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
            const account = await this.addAccount.add({
                name,
                email,
                password
            })
            return ok(account)
        } catch (error) {
            return serverError(error)
        }
    }
}