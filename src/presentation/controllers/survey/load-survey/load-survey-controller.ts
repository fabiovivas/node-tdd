import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { ok, serverError } from '../../../helpers/http/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http-request'

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveys) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const surveys = await this.loadSurveys.load()
            return ok(surveys)
        } catch (error) {
            return serverError(error)
        }
    }
}