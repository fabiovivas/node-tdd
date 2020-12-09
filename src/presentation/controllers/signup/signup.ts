import { AddAccount } from '../../../domain/usecases/add-account'
import { badResquest, ok, serverError } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http-request'

export class SignUpController implements Controller {
    private readonly addAccount: AddAccount
    private readonly validation: Validation

    constructor(addAccount: AddAccount, validation: Validation) {
        this.addAccount = addAccount
        this.validation = validation
    }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpeRequest.body)
            if (error) return badResquest(error)

            const { name, email, password } = httpeRequest.body
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