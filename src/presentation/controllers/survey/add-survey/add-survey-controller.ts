import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http-request'
import { Validation } from '../../../protocols/validation'

export class AddSurveyController implements Controller {
    constructor(private readonly validation: Validation) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        this.validation.validate(httpRequest.body)
        return null
    }
}