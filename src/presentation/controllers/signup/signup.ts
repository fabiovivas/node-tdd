import { AddAccount } from '../../../domain/usecases/add-account'
import { InvalidParamError } from '../../error/invalid-param-error'
import { badResquest, ok, serverError } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount
    private readonly validation: Validation

    constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
        this.validation = validation
    }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpeRequest.body)
            if (error) return badResquest(error)

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