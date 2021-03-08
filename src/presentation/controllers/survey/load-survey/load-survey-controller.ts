import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http-request'

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveys) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const surveys = await this.loadSurveys.loadAll()
            return surveys.length ? ok(surveys) : noContent()
        } catch (error) {
            return serverError(error)
        }
    }
}