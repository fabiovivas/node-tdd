import { badResquest } from '../../../helpers/http/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http-request'
import { Validation } from '../../../protocols/validation'

export class AddSurveyController implements Controller {
    constructor(private readonly validation: Validation) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = this.validation.validate(httpRequest.body)
        if (error) return badResquest(error)
        return null
    }
}