import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/error/invalid-param-error'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller } from '@/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http-request'

export class SaveSurveyResultController implements Controller {
    constructor(private readonly loadSurveyById: LoadSurveyById) { }
    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { surveyId } = httpeRequest.params
            const { answer } = httpeRequest.body

            const surveyResult = await this.loadSurveyById.loadById(surveyId)
            if (!surveyResult) return forbidden(new InvalidParamError('surveyId'))

            const answers = surveyResult.answers.map(a => a.answer)
            if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
            return null
        } catch (error) {
            return serverError(error)
        }
    }
}