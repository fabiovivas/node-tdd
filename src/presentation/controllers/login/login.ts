import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError } from '../../error/invalid-param-error'
import { MissingParamError } from '../../error/missing-param-error'
import { badResquest, serverError, unauthorized } from '../../helpers/http-helper'
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
            const requiredFields = ['email', 'password']
            for (const field of requiredFields) {
                if (!httpeRequest.body[field]) {
                    return badResquest(new MissingParamError(field))
                }
            }

            const { email, password } = httpeRequest.body
            const isValid = this.emailValidator.isValid(email)
            if (!isValid) return badResquest(new InvalidParamError('email'))

            const accesstoken = await this.authentication.auth(email, password)
            if (!accesstoken) return unauthorized()
        } catch (error) {
            return serverError(error)
        }
    }
}