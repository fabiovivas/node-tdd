import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http-request'

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveys) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        await this.loadSurveys.load()
        return null
    }
}