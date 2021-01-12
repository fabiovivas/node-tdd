import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../../presentation/protocols/controller'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '../../../usecases/survey/add-survey/db-add-account-factory'
import { makeSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
    const surveyController = new AddSurveyController(makeSurveyValidation(), makeDbAddSurvey())
    return makeLogControllerDecorator(surveyController)
}