import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-survey/load-survey-controller'
import { Controller } from '../../../../../presentation/protocols/controller'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '../../../usecases/survey/load-survey/db-load-survey-factory'

export const makeLoadSurveyController = (): Controller => {
    const surveyController = new LoadSurveysController(makeDbLoadSurveys())
    return makeLogControllerDecorator(surveyController)
}