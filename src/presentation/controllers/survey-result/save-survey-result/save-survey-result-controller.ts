import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { Controller } from '@/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http-request'

export class SaveSurveyResultController implements Controller {
    constructor(private readonly loadSurveyById: LoadSurveyById) { }
    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        await this.loadSurveyById.loadById(httpeRequest.params.surveyId)
        return null
    }
}