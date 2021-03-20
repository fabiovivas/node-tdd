import { SurveyResultModel } from '@/domain/model/survey-result-model'
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => {
    return {
        id: 'any_id',
        surveyId: 'any_survey_id',
        accountId: 'any_account_id',
        answer: 'any_answer',
        date: new Date()
    }
}

export const mockSurveyResultParams = (): SaveSurveyResultParams => {
    return {
        surveyId: 'any_survey_id',
        accountId: 'any_account_id',
        answer: 'any_answer',
        date: new Date()
    }
}